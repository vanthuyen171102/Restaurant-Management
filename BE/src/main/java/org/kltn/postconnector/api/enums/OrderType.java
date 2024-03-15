package org.kltn.postconnector.api.enums;

import lombok.Getter;

@Getter
public enum OrderType {
    DELIVERY,
    DINE_IN;

    public static boolean isValidType(String type) {
        for (OrderType orderType : OrderType.values()) {
            if (orderType.name().equals(type)) {
                return true;
            }
        }
        return false;
    }
}




