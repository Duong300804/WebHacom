package com.example.computer_store.response;

import lombok.Data;

import java.util.Date;

@Data
public class UserResponse {
    private long id;
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String address;
    private Date createDate;
    private Date updateDate;
    private String deleteFlag;
    private String position;
}
