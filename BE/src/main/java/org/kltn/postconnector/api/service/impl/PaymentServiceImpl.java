package org.kltn.postconnector.api.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lib.payos.PayOS;
import com.lib.payos.type.ItemData;
import com.lib.payos.type.PaymentData;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Order;
import org.kltn.postconnector.api.domain.Payment;
import org.kltn.postconnector.api.domain.TableOrder;
import org.kltn.postconnector.api.enums.PaymentMethod;
import org.kltn.postconnector.api.enums.PaymentStatus;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.InternalServerErrorException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.OrderRepository;
import org.kltn.postconnector.api.repository.PaymentRepository;
import org.kltn.postconnector.api.service.PaymentService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final PayOS payOS;


    @Override
    public String createPaymentLink(int orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn muốn tạo link thanh toán!"));
            if (order.getPaymentStatus() == PaymentStatus.PAID)
                throw new BadRequestException("Hóa đơn #%d đã được thanh toán!".formatted(orderId));
            else if (order.getPaymentStatus() == PaymentStatus.REFUND_NEEDED) {
                throw new BadRequestException("Hóa đơn #%d cần hoàn tiền cho khách!".formatted(orderId));
            }

            int price = (int) (order.getGrandTotal() - order.getPaid());
//            final int price = 10000;

            Optional<Payment> similarPayment = order.getPayments().stream()
                    .filter(payment -> payment.getPaymentStatus().equals(PaymentStatus.PENDING)
                            && payment.getPaymentMethod().equals(PaymentMethod.TRANSFER)
                            && StringUtils.hasText(payment.getPaymentUrl())
                            && payment.getAmount() == price).findFirst();

            if (similarPayment.isPresent())
                return similarPayment.get().getPaymentUrl();

            String currentTimeString = String.valueOf(new Date().getTime());
            int orderCode = generatePaymentId();
            final String productName = "Thanh toán hóa đơn #%s".formatted(orderId);
            final String description = "Thanh toán hóa đơn #%s".formatted(orderId);

            final String returnUrl = "http://localhost:5173/payment-success";
            final String cancelUrl = "http://localhost:5173/payment-cancel";

            // Gen order code

            ItemData item = new ItemData(productName, 1, price);
            List<ItemData> itemList = new ArrayList<>();
            itemList.add(item);

            PaymentData paymentData = new PaymentData(orderCode, price, description,
                    itemList, cancelUrl, returnUrl);


            JsonNode data = payOS.createPaymentLink(paymentData);
            String checkoutUrl = data.get("checkoutUrl").asText();

            Payment payment = Payment.builder()
                    .id(orderCode)
                    .order(order)
                    .amount(price)
                    .paymentUrl(checkoutUrl)
                    .paymentMethod(PaymentMethod.TRANSFER)
                    .build();
            paymentRepository.save(payment);

            return checkoutUrl;
        } catch (ResourceNotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalServerErrorException("Không thể tạo link thanh toán cho hóa đơn #%d".formatted(orderId));
        }
    }

    @Override
    public Payment getPaymentDetail(int id) {
        return paymentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy giao dịch có mã ID={%d}".formatted(id))
        );
    }

    @Override
    @Transactional
    public void successCashPayment(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn ID = %d".formatted(orderId)));
        if (order.getPaymentStatus() == PaymentStatus.PAID)
            throw new BadRequestException("Hóa đơn #%d đã được thanh toán".formatted(orderId));


        Payment payment = Payment.builder()
                .id(generatePaymentId())
                .order(order)
                .amount(order.getGrandTotal() - order.getPaid())
                .paymentMethod(PaymentMethod.CASH)
                .paidAmount(order.getGrandTotal() - order.getPaid())
                .build();

        paymentRepository.save(payment);

        order.setPaid(order.getGrandTotal());
        order.preUpdate();
        Order updatedOrder = orderRepository.save(order);

        messagingTemplate.convertAndSend("/topic/payment/success-payment/" + order.getId(), order);
        messagingTemplate.convertAndSend(String.format("/topic/order/update/%s", updatedOrder.getId()), updatedOrder);

    }

    public void confirmTransferPayment(ObjectNode body) {
        try {
            JsonNode data = payOS.verifyPaymentWebhookData(body);

            int paymentId = data.get("orderCode").asInt();
            int amount = data.get("amount").asInt();

            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch {PaymentID = %d}".formatted(paymentId)));

            if (payment.getPaymentStatus() == PaymentStatus.PAID)
                throw new BadRequestException("Giao dịch #%d đã hoàn thành trước đó!".formatted(paymentId));

            payment.setPaidAmount(payment.getPaidAmount() + amount);

            Order order = payment.getOrder();
            order.setPaid(order.getPaid() + amount);

            Order updatedOrder = orderRepository.save(order);
            paymentRepository.save(payment);

            messagingTemplate.convertAndSend("/topic/payment/success-payment/" + order.getId(), updatedOrder);
            messagingTemplate.convertAndSend(String.format("/topic/order/update/%s", updatedOrder.getId()), updatedOrder);

        } catch (Exception e) {
        }
    }

    private int generatePaymentId() {
        String currentTimeString = String.valueOf(new Date().getTime());
        return Integer.parseInt(currentTimeString.substring(currentTimeString.length() - 6));
    }

    @Override
    public void remind(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn ID = %d".formatted(orderId)));
        if (!order.getPaymentStatus().equals(PaymentStatus.REFUND_NEEDED))
            throw new BadRequestException("Hóa đơn %s không cần hoàn tiền!".formatted(orderId));

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaid(order.getGrandTotal());
        Order updatedOrder = orderRepository.save(order);
        messagingTemplate.convertAndSend(String.format("/topic/order/update/%s", updatedOrder.getId()), updatedOrder);
        for (TableOrder tableOrder : order.getTables()) {
            messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
        }
    }
}
