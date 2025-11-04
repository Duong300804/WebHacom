package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class TagResponse {
    private long id;
    private String name;
    private Date createdAt;
    private Date updatedAt;
    private String deleteFlag;
}
