package com.example.computer_store.response.Auth;

import lombok.Data;

@Data
public class UpdateProfileResponse {
    private long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
}
