package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import org.kltn.postconnector.api.enums.OrderType;

import java.util.*;

@Data
@Getter
public class OrderDTO {

    @NotNull(message = "Hãy chọn Phục vụ tại nhà hàng hay Ship")
    private OrderType type;

    private String address;

    private Float shippingFee;

    private Set<Integer> tableIds = new HashSet<>();

    private List<OrderItemDTO> items = new ArrayList<>();

    @AssertTrue(message = "Thông tin tạo hóa đơn không hợp lệ!")
    public boolean isValid() {
        if (type == OrderType.DINE_IN) {
            return !tableIds.isEmpty();
        }

        if (type == OrderType.DELIVERY) {
            return (address != null && !address.isBlank() && shippingFee != null && shippingFee >= 0);
        }
        return false;
    }


}
