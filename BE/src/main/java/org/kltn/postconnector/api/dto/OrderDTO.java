package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import org.kltn.postconnector.api.enums.OrderType;
import org.springframework.util.StringUtils;

import java.util.List;

@Data
@Getter
public class OrderDTO {

    @NotBlank(message = "Hãy chọn Phục vụ tại nhà hàng hay Ship")
    private String type;

    private String address;

    @JsonProperty(value = "shipping_fee")
    private Float shippingFee;

    @JsonProperty(value = "table_id")
    private Byte tableId;

    private List<OrderItemDTO> items;

    @AssertTrue(message = "Thông tin đơn hàng không hợp lệ!")
    public boolean isValid() {
            if(OrderType.isValidType(this.type)) {
                OrderType orderType = OrderType.valueOf(type);
                if (orderType == OrderType.DINE_IN) {
                    return tableId != null;
                }

                if (orderType == OrderType.DELIVERY) {
                    return (StringUtils.hasText(address) && shippingFee != null && shippingFee >= 0);
                }
                return false;
            }
            else {
               return false;
            }
    }
}
