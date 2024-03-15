package org.kltn.postconnector.api.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PagedResponse {
    @JsonProperty(value = "total")
    private long total;

    @JsonProperty(value = "current_page")
    private int currentPage;

    @JsonProperty(value = "total_page")
    private int totalPage;

}
