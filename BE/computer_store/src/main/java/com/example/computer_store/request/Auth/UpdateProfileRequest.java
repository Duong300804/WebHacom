package com.example.computer_store.request.Auth;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String address;
    private String email;

    private static final String NAME_REGEX = "^[\\p{L} ]+$";
    private static final String ADDRESS_REGEX = "^[\\p{L}0-9 /,.-]+$";
    private static final String PHONE_REGEX = "^(0[0-9]{9}|\\+84[0-9]{9})$";
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    public boolean isValid(){
        if (fullName != null) fullName = fullName.trim();
        if (phone != null) phone = phone.trim();
        if (address != null) address = address.trim();
        if (email != null) email = email.trim();
        return StringUtils.hasText(fullName) &&
                StringUtils.hasText(phone) &&
                StringUtils.hasText(address) &&
                StringUtils.hasText(email) &&
                fullName.matches(NAME_REGEX) &&
                phone.matches(PHONE_REGEX) &&
                email.matches(EMAIL_REGEX) &&
                address.matches(ADDRESS_REGEX);
    }
}
