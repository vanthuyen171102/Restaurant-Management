package org.kltn.postconnector.api.event;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StockUpdateEvent {
    private int id;
    private int stock;
}
