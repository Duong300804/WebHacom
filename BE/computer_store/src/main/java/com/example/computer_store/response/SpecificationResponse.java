package com.example.computer_store.response;
import lombok.Data;

import java.util.Date;

@Data
public class SpecificationResponse {
    private long id;
    private String name;
    private String description;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
}
