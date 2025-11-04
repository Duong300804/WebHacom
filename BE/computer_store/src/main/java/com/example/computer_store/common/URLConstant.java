package com.example.computer_store.common;

public class URLConstant {
    public static final String HEAD_API = "/api";
    public static final String IMAGES_API = "/images/**";
    public static final String UPLOAD_IMAGE = HEAD_API + "/upload-image";

    public static class AUTH_API {
        public static final String LOGIN = HEAD_API + "/login";
        public static final String REGISTER = HEAD_API + "/register";
        public static final String PROFILE = HEAD_API + "/profile";
        public static final String UPDATE_PROFILE = HEAD_API + "/update_profile";
        public static final String CHANGE_PASSWORD = HEAD_API + "/change_password";
        public static final String FORGOT_PASSWORD = HEAD_API + "/forgot_password";
    }
    public static class USER_API{
        public static final String USER = HEAD_API + "/user";
        public static final String GET_All_USER = USER + "/get_all";
        public static final String GET_All_ACCOUNT = USER + "/get_all_account";
        public static final String GET_USER_BY_ID = USER + "/get_by_id/{id}";
        public static final String CREATE_USER = USER + "/create";
        public static final String UPDATE_USER = USER + "/update/{id}";
        public static final String DELETE_USER = USER + "/delete/{id}";
        public static final String SEARCH_USER = USER + "/search";
        public static final String SEARCH_ACCOUNT = USER + "/search_account";
        public static final String FILTER_USER = USER + "/filter";
        public static final String FILTER_ACCOUNT = USER + "/filter_account";
    }

    public static class CATEGORY_API {
        public static final String CATEGORY = HEAD_API + "/category";
        public static final String GET_ALL_CATEGORY = CATEGORY + "/get_all";
        public static final String GET_CATEGORY_BY_ID = CATEGORY + "/get_by_id/{id}";
        public static final String CREATE_CATEGORY = CATEGORY + "/create";
        public static final String UPDATE_CATEGORY = CATEGORY + "/update/{id}";
        public static final String DELETE_CATEGORY = CATEGORY + "/delete/{id}";
        public static final String SEARCH_CATEGORY = CATEGORY + "/search";
        public static final String FILTER_CATEGORY = CATEGORY + "/filter";
    }

    public static class BRAND_API {
        public static final String BRAND = HEAD_API + "/brand";
        public static final String GET_ALL_BRAND = BRAND + "/get_all";
        public static final String GET_BRAND_BY_ID = BRAND + "/get_by_id/{id}";
        public static final String CREATE_BRAND = BRAND + "/create";
        public static final String UPDATE_BRAND = BRAND + "/update/{id}";
        public static final String DELETE_BRAND = BRAND + "/delete/{id}";
        public static final String SEARCH_BRAND = BRAND + "/search";
        public static final String FILTER_BRAND = BRAND + "/filter";
    }

    public static class TAG_API {
        public static final String TAG = HEAD_API + "/tag";
        public static final String GET_ALL_TAG = TAG + "/get_all";
        public static final String GET_TAG_BY_ID = TAG + "/get_by_id/{id}";
        public static final String CREATE_TAG = TAG + "/create";
        public static final String UPDATE_TAG = TAG + "/update/{id}";
        public static final String DELETE_TAG = TAG + "/delete/{id}";
        public static final String SEARCH_TAG = TAG + "/search";
        public static final String FILTER_TAG = TAG + "/filter";
    }

    public static class PRODUCT_API {
        public static final String PRODUCT = HEAD_API + "/product";
        public static final String GET_ALL_PRODUCT = PRODUCT + "/get_all";
        public static final String GET_PRODUCT_BY_ID = PRODUCT + "/get_by_id/{id}";
        public static final String CREATE_PRODUCT = PRODUCT + "/create";
        public static final String UPDATE_PRODUCT = PRODUCT + "/update/{id}";
        public static final String DELETE_PRODUCT = PRODUCT + "/delete/{id}";
        public static final String SEARCH_PRODUCT = PRODUCT + "/search";
        public static final String FILTER_PRODUCT = PRODUCT + "/filter";
        public static final String GET_BY_CATEGORY = PRODUCT + "/get_by_category/{categoryId}";
        public static final String SORT_PRODUCT_BY_PRICE_ASC = PRODUCT + "/sort/price_asc";
        public static final String SORT_PRODUCT_BY_PRICE_DESC = PRODUCT + "/sort/price_desc";
        public static final String SORT_PRODUCT_BY_NEWEST = PRODUCT + "/sort/newest";
        public static final String COUNT_PRODUCT_BY_FILTER = PRODUCT + "/count_by_filter";
    }

    public static class ORDER_API {
        public static final String ORDER = HEAD_API + "/order";
        public static final String GET_ALL_ORDER = ORDER + "/get_all";
        public static final String GET_ORDER_BY_ID = ORDER + "/get_by_id/{id}";
        public static final String CREATE_ORDER = ORDER + "/create";
        public static final String UPDATE_ORDER = ORDER + "/update/{id}";
        public static final String DELETE_ORDER = ORDER + "/delete/{id}";
        public static final String GET_MY_ORDERS = ORDER + "/my_orders";
        public static final String SEARCH_ORDER = ORDER + "/search";
        public static final String FILTER_ORDER = ORDER + "/filter";
        public static final String CANCEL_ORDER = ORDER + "/cancel/{id}";
        public static final String TRACK_ORDER = ORDER + "/track";
    }

    public static class DASHBOARD_API {
        public static final String DASHBOARD = HEAD_API + "/dashboard";
        public static final String GET_TOTAL_PRODUCTS = DASHBOARD + "/total_products";
        public static final String GET_TOTAL_PRODUCTS_SOLD = DASHBOARD + "/total_products_sold";
        public static final String GET_TOTAL_REVENUE = DASHBOARD + "/total_revenue";
        public static final String GET_TOTAL_ORDERS = DASHBOARD + "/total_orders";
        public static final String GET_TOTAL_CUSTOMERS = DASHBOARD + "/total_customers";
        public static final String GET_REVENUE_BY_MONTH = DASHBOARD + "/revenue_by_month";
        public static final String GET_REVENUE_BY_CATEGORY = DASHBOARD + "/revenue_by_category";
        public static final String GET_RECENT_ORDERS = DASHBOARD + "/recent_orders";
        public static final String GET_RECENT_PRODUCTS = DASHBOARD + "/recent_products";
        public static final String GET_TOP_PRODUCTS = DASHBOARD + "/top_products";
        public static final String GET_RECENT_CUSTOMERS = DASHBOARD + "/recent_customers";
    }

    public static class NOTIFICATION_API {
        public static final String NOTIFICATION = HEAD_API + "/notification";
        public static final String GET_ALL_NOTIFICATIONS = NOTIFICATION + "/get_all";
        public static final String GET_NOTIFICATION_BY_ID = NOTIFICATION + "/get_by_id/{id}";
        public static final String MARK_AS_READ = NOTIFICATION + "/mark_as_read/{id}";
        public static final String MARK_ALL_AS_READ = NOTIFICATION + "/mark_all_as_read";
        public static final String GET_UNREAD_NOTIFICATIONS = NOTIFICATION + "/unread";
    }

    public static class BANNER_API {
        public static final String BANNER = HEAD_API + "/banner";
        public static final String GET_ALL_BANNER = BANNER + "/get_all";
        public static final String GET_BANNER_BY_ID = BANNER + "/get_by_id/{id}";
        public static final String CREATE_BANNER = BANNER + "/create";
        public static final String UPDATE_BANNER = BANNER + "/update/{id}";
        public static final String DELETE_BANNER = BANNER + "/delete/{id}";
        public static final String SEARCH_BANNER = BANNER + "/search";
        public static final String FILTER_BANNER = BANNER + "/filter";
    }

    public static class NEWS_API {
        public static final String NEWS = HEAD_API + "/news";
        public static final String GET_ALL_NEWS = NEWS + "/get_all";
        public static final String GET_NEWS_BY_ID = NEWS + "/get_by_id/{id}";
        public static final String CREATE_NEWS = NEWS + "/create";
        public static final String UPDATE_NEWS = NEWS + "/update/{id}";
        public static final String DELETE_NEWS = NEWS + "/delete/{id}";
        public static final String SEARCH_NEWS = NEWS + "/search";
        public static final String FILTER_NEWS = NEWS + "/filter";
    }

    public static class STAFF_API {
        public static final String STAFF = HEAD_API + "/staff";
        public static final String GET_ALL_STAFF = STAFF + "/get_all";
        public static final String GET_STAFF_BY_ID = STAFF + "/get_by_id/{id}";
        public static final String CREATE_STAFF = STAFF + "/create";
        public static final String UPDATE_STAFF = STAFF + "/update/{id}";
        public static final String DELETE_STAFF = STAFF + "/delete/{id}";
        public static final String SEARCH_STAFF = STAFF + "/search";
        public static final String FILTER_STAFF = STAFF + "/filter";
    }

}
