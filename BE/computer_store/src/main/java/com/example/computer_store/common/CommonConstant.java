package com.example.computer_store.common;

public class CommonConstant {
    public static class DELETE_FLG {
        public static String DELETE = "1";
        public static String NON_DELETE = "0";
        public static Integer DELETE_INT = 1;
        public static Integer NON_DELETE_INT = 0;
    }

    public static class COMMON_RESPONSE {
        public static int OK = 200;
        public static int CREATED = 201;
        public static int NON_AUTH = 203;
        public static int NO_CONTENT = 204;
        public static final int BAD_REQUEST = 400;
        public static final int UNAUTHORIZED = 401;
        public static int PERMISSION_DENIED = 403;
        public static final int NOT_FOUND = 404;
        public static final int CONFLICT = 409;
        public static int NOT_VALID = 422;
        public static int EXCEPTION = 500;
    }

    public static class COMMON_MESSAGE {
        //AUTH + USER
        public static String OK = "OK";
        public static String NOT_AUTHORITY = "USER_NOT_AUTHORITY";
        public static String OLD_PASSWORD_INCORRECT = "OLD_PASSWORD_INCORRECT";
        public static String CONFIRM_PASSWORD_NOT_MATCH = "CONFIRM_PASSWORD_NOT_MATCH";
        public static String PASSWORD_CHANGED = "PASSWORD_CHANGED";
        public static String INVALID_USERNAME_OR_EMAIL = "INVALID_USERNAME_OR_EMAIL";
        public static String PASSWORD_INCORRECT = "USERNAME_OR_PASSWORD_INCORRECT";
        public static String INVALID_PARAMETER = "INVALID_DATA";
        public static String EXIST_USERNAME = "USERNAME_EXIST";
        public static String EXIST_EMAIL = "EMAIL_EXIST";
        public static String EXIST_PHONE = "PHONE_EXIST";
        public static String EXCEPTION = "EXCEPTION";
        public static String NOT_FOUND_USER = "NOT_FOUND_USER";
        public static String USER_DELETED = "USER_DELETED";
        public static String INVALID_POSITION = "INVALID_POSITION";
        //CATEGORY
        public static final String NOT_FOUND_CATEGORY = "Category not found";
        public static final String NOT_FOUND_PARENT_CATEGORY = "Parent category not found";
        public static final String INVALID_PARENT_CATEGORY = "Category cannot be its own parent";
        public static final String EXIST_CATEGORY_NAME = "Category name already exists";
        public static final String CATEGORY_DELETED = "Category deleted successfully";
        public static final String CATEGORY_HAS_SUBCATEGORIES = "Cannot delete category with subcategories";
        //BRAND
        public static final String NOT_FOUND_BRAND = "Brand not found";
        public static final String EXIST_BRAND_NAME = "Brand name already exists";
        public static final String BRAND_DELETED = "Brand deleted successfully";
        //TAG
        public static final String NOT_FOUND_TAG = "Tag not found";
        public static final String EXIST_TAG_NAME = "Tag name already exists";
        public static final String TAG_DELETED = "Tag deleted successfully";
        //PRODUCT
        public static final String NOT_FOUND_PRODUCT = "Product not found";
        public static final String EXIST_PRODUCT_CODE = "Product code already exists";
        public static final String PRODUCT_DELETED = "Product deleted successfully";
        // ORDER
        public static final String NOT_FOUND_ORDER = "ORDER NOT FOUND";
        public static final String ORDER_CREATED = "ORDER CREATED SUCCESSFULLY";
        public static final String ORDER_UPDATED = "ORDER UPDATED SUCCESSFULLY";
        public static final String ORDER_DELETED = "ORDER DELETED SUCCESSFULLY";
        public static final String ORDER_CANCELLED = "ORDER HAS BEEN CANCELLED";
        public static final String INSUFFICIENT_STOCK = "INSUFFICIENT STOCK AVAILABLE";
        public static final String INVALID_ORDER_STATUS = "INVALID ORDER STATUS";
        public static final String ORDER_STATUS_CANNOT_CHANGE = "CANNOT CHANGE THIS ORDER STATUS";

        public static String USER_NOT_LOGIN = "USER_NOT_LOGIN";
        public static String USER_NOT_LOGIN_OR_QUALIFIED = "USER NOT QUALIFIED TO STAMP";
        public static String NOT_CONVERT = "CAN_NOT_CONVERT";
        public static String EXIST_KEY = "KEY_EXIST";
        public static String EXIST_TOKEN = "TOKEN_IS_EXIST";
        public static String EMPTY = "EMPTY";
        public static String USER_CURRENT_IN_NOT_FINISH_REQUEST_STAMP = "USER_CURRENT_IN_NOT_FINISH_REQUEST_STAMP";
        public static String NOT_FOUND = "NOT_FOUND";
        public static String USE = "USER STAMPED";
        public static String ACCESS_DENIED = "ROLE_ACCESS_DENIED";
        public static String ROLL_NOT_OF_STOCK = "NOT_SAVE_IN_STOCK";
        public static String ROLL_PULLING_IS_DELETE = "PULL_ROLL_DELETED";
        public static String CODE_INVALID = "CODE_INVALID";
        public static String NOT_EXIST = "NOT_EXIST";
    }

    public static class CONFIG {
        public final static String JPADataSource = "JPADataSource";
        public final static String JPAEntityManagerFactory = "JPAEntityManagerFactory";
        public final static String JPATransactionManager = "JPATransactionManager";
        public final static String HibernateDataSource = "hibernateDataSource";
        public final static String HibernateSessionFactory = "hibernateSessionFactory";
        public final static String HibernateTransactionManager = "hibernateTransactionManager";
    }

}
