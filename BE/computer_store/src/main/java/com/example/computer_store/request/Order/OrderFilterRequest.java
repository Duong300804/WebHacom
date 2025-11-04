package com.example.computer_store.request.Order;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class OrderFilterRequest {
    private Long userId;
    private String status;
    private Long minTotal;
    private Long maxTotal;
    private Date startDate;
    private Date endDate;
}
