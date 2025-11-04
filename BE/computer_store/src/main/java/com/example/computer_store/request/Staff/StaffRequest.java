package com.example.computer_store.request.Staff;

import lombok.Data;
import org.springframework.util.StringUtils;
import java.util.Arrays;
import java.util.List;

@Data
public class StaffRequest {
    private String fullName;
    private String phone;
    private String address;
    private String position;

    private static final String NAME_REGEX = "^[\\p{L} ]+$";
    private static final String ADDRESS_REGEX = "^[\\p{L}0-9 /,.-]+$";
    private static final String PHONE_REGEX = "^(0[0-9]{9}|\\+84[0-9]{9})$";
    private static final List<String> VALID_POSITIONS = Arrays.asList("SALE", "TECHNICIAN", "SERVICE", "WARRANTY");

    public boolean isValid() {
        if (fullName != null) fullName = fullName.trim();
        if (phone != null) phone = phone.trim();
        if (address != null) address = address.trim();
        if (position != null) position = position.trim().toUpperCase();

        if (!StringUtils.hasText(fullName) || !fullName.matches(NAME_REGEX)) return false;
        if (!StringUtils.hasText(phone) || !phone.matches(PHONE_REGEX)) return false;
        if (!StringUtils.hasText(address) || !address.matches(ADDRESS_REGEX)) return false;
        if (!StringUtils.hasText(position) || !VALID_POSITIONS.contains(position)) return false;

        return true;
    }
}