package com.example.computer_store.request.User;

import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Data
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    private String fullName;
    private String phone;
    private String address;
    private String position;

    private static final String NAME_REGEX = "^[\\p{L} ]+$";
    private static final String ADDRESS_REGEX = "^[\\p{L}0-9 /,.-]+$";
    private static final String PHONE_REGEX = "^(0[0-9]{9}|\\+84[0-9]{9})$";
    private static final String USERNAME_REGEX = "^[a-zA-Z0-9]+$";
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    private static final List<String> VALID_POSITIONS = Arrays.asList("SALE", "TECHNICIAN", "SERVICE", "WARRANTY");

    public boolean isValid() {
        if (username != null) username = username.trim();
        if (email != null) email = email.trim();
        if (password != null) password = password.trim();
        if (role != null) role = role.trim();
        if (fullName != null) fullName = fullName.trim();
        if (phone != null) phone = phone.trim();
        if (address != null) address = address.trim();
        if (position != null) position = position.trim().toUpperCase();
        if (!StringUtils.hasText(role) || !Arrays.asList("ADMIN", "STAFF", "CUSTOMER").contains(role)) {
            return false;
        }
        if ("STAFF".equals(role)) {
            if (!StringUtils.hasText(fullName) || !fullName.matches(NAME_REGEX)) return false;
            if (!StringUtils.hasText(phone) || !phone.matches(PHONE_REGEX)) return false;
            if (!StringUtils.hasText(address) || !address.matches(ADDRESS_REGEX)) return false;
            if (!StringUtils.hasText(position) || !VALID_POSITIONS.contains(position)) return false;
        } else {
            // For ADMIN/CUSTOMER, position must be null
            if (StringUtils.hasText(position)) return false;
        }
        if (!StringUtils.hasText(username) || !StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            return false;  // Bắt buộc cho user endpoints (có tài khoản)
        }
        if (!username.matches(USERNAME_REGEX)) return false;
        if (!email.matches(EMAIL_REGEX)) return false;

        // Optional fields for non-STAFF
        if (StringUtils.hasText(fullName) && !fullName.matches(NAME_REGEX)) return false;
        if (StringUtils.hasText(phone) && !phone.matches(PHONE_REGEX)) return false;
        if (StringUtils.hasText(address) && !address.matches(ADDRESS_REGEX)) return false;

        return true;
    }

    public boolean isValidUpdate() {
        if (username != null) username = username.trim();
        if (email != null) email = email.trim();
        if (role != null) role = role.trim();
        if (fullName != null) fullName = fullName.trim();
        if (phone != null) phone = phone.trim();
        if (address != null) address = address.trim();
        if (position != null) position = position.trim().toUpperCase();
        if (!StringUtils.hasText(role) || !Arrays.asList("ADMIN", "STAFF", "CUSTOMER").contains(role)) {
            return false;
        }
        if ("STAFF".equals(role)) {
            if (fullName != null && !fullName.matches(NAME_REGEX)) return false;
            if (phone != null && !phone.matches(PHONE_REGEX)) return false;
            if (address != null && !address.matches(ADDRESS_REGEX)) return false;
            if (position != null && !VALID_POSITIONS.contains(position)) return false;
        }
//        if ("STAFF".equals(role)) {
//            if (!StringUtils.hasText(fullName) || !fullName.matches(NAME_REGEX)) return false;
//            if (!StringUtils.hasText(phone) || !phone.matches(PHONE_REGEX)) return false;
//            if (!StringUtils.hasText(address) || !address.matches(ADDRESS_REGEX)) return false;
//            if (!StringUtils.hasText(position) || !VALID_POSITIONS.contains(position)) return false;
//        } else {
//            if (StringUtils.hasText(position)) return false;
//        }
//
//        if (!StringUtils.hasText(username) || !StringUtils.hasText(email)) {
//            return false;
//        }
//        if (!username.matches(USERNAME_REGEX)) return false;
//        if (!email.matches(EMAIL_REGEX)) return false;
//
//        if (StringUtils.hasText(fullName) && !fullName.matches(NAME_REGEX)) return false;
//        if (StringUtils.hasText(phone) && !phone.matches(PHONE_REGEX)) return false;
//        if (StringUtils.hasText(address) && !address.matches(ADDRESS_REGEX)) return false;

        return true;
    }

}
