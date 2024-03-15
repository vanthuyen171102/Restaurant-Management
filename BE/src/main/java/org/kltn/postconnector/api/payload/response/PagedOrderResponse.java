package org.kltn.postconnector.api.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.kltn.postconnector.api.model.Order;

import java.util.List;

public class PagedOrderResponse extends PagedResponse{
    @JsonProperty(value = "orders")
    private List<Order> orders;

    public PagedOrderResponse(List<Order> orders, long total, int currentPage, int totalPage) {
        super(total, currentPage, totalPage);
        this.orders = orders;
    }
}
