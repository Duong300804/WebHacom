package com.example.computer_store.request.Staff;

import lombok.Data;

@Data
public class StaffFilterRequest {
    private String fullName;
    private String phone;
    private String address;
    private String position;
}