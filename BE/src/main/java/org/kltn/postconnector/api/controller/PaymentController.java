package org.kltn.postconnector.api.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Payment;
import org.kltn.postconnector.api.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/get-payment-detail/{id}")
    @PreAuthorize("isAuthenticated()")
    public Payment getPaymentDetail(@PathVariable(name = "id") int id) {
        return paymentService.getPaymentDetail(id);
    }

    @PostMapping("/create-payment/{id}")
    @PreAuthorize("isAuthenticated()")
    public String createOnlinePayment(@PathVariable("id") int orderId) {
        return paymentService.createPaymentLink(orderId);
    }

    @PostMapping("/remind/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public void remind(@PathVariable("id") int orderId) {
         paymentService.remind(orderId);
    }

    @PostMapping(value = "/success-cash-payment/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public void successCashPayment(@PathVariable("id") int orderId) {
        paymentService.successCashPayment(orderId);
    }



    @PostMapping("/confirm-transfer-payment")
    public void successTransferPayment(@RequestBody ObjectNode body) {
        paymentService.confirmTransferPayment(body);
    }

    @PostMapping("/zalo-mini-app-webhook")
    public void webhook(@RequestBody ObjectNode body) {
        System.out.println(body);;
    }
}
