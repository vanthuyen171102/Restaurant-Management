package org.kltn.postconnector.api.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.kltn.postconnector.api.domain.Payment;

public interface PaymentService {
    String createPaymentLink(int orderId);

    Payment getPaymentDetail(int id);

    void successCashPayment(int orderId);
    void remind(int orderId);
    void confirmTransferPayment(ObjectNode body);
}
