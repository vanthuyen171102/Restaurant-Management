package org.kltn.postconnector.api.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    @JsonProperty(value = "total")
    private long total;

    @JsonProperty(value = "currentPage")
    private int currentPage;

    @JsonProperty(value = "totalPage")
    private int totalPage;

    @JsonProperty(value = "items")
    private List<T> items;

}
