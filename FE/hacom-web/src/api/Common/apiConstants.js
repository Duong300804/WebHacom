const api_constant = {
    AUTH_API: {
      LOGIN: "/login",
      REGISTER: "/register",
      PROFILE: "/profile",
      UPDATE_PROFILE: "/update_profile",
      CHANGE_PASSWORD: "/change_password",
      FORGOT_PASSWORD: "/forgot_password",
    },

    USER_API: {
      GET_All_USER: "/user/get_all",
      GET_USER_BY_ID: "/user/get_by_id/:id",
      CREATE_USER: "/user/create",
      UPDATE_USER: "/user/update/:id",
      DELETE_USER: "/user/delete/:id",
      SEARCH_USER: "/user/search",
      FILTER_USER: "/user/filter",
      GET_ALL_ACCOUNT: "/user/get_all_account",
      FILTER_ACCOUNT: "/user/filter_account",
      SEARCH_ACCOUNT: "/user/search_account",
    },

    STAFF_API: {
      GET_ALL_STAFF: "/staff/get_all",
      GET_STAFF_BY_ID: "/staff/get_by_id/:id",
      CREATE_STAFF: "/staff/create",
      UPDATE_STAFF: "/staff/update/:id",
      DELETE_STAFF: "/staff/delete/:id",
      SEARCH_STAFF: "/staff/search",
      FILTER_STAFF: "/staff/filter",
    },

    BRAND_API: {
      GET_ALL_BRAND: "/brand/get_all",
      GET_BRAND_BY_ID: "/brand/get_by_id/:id",
      CREATE_BRAND: "/brand/create",
      UPDATE_BRAND: "/brand/update/:id",
      DELETE_BRAND: "/brand/delete/:id",
      SEARCH_BRAND: "/brand/search",
      FILTER_BRAND: "/brand/filter",
    },

    TAG_API: {
      GET_ALL_TAG: "/tag/get_all",
      GET_TAG_BY_ID: "/tag/get_by_id/:id",
      CREATE_TAG: "/tag/create",
      UPDATE_TAG: "/tag/update/:id",
      DELETE_TAG: "/tag/delete/:id",
      SEARCH_TAG: "/tag/search",
      FILTER_TAG: "/tag/filter",
    },

    CATEGORY_API: {
      GET_ALL_CATEGORY: "/category/get_all",
      GET_CATEGORY_BY_ID: "/category/get_by_id/{id}",
      CREATE_CATEGORY: "/category/create",
      UPDATE_CATEGORY: "/category/update/{id}",
      DELETE_CATEGORY: "/category/delete/{id}",
      SEARCH_CATEGORY: "/category/search",
      FILTER_CATEGORY: "/category/filter",
    },

    PRODUCT_API: {
      GET_ALL_PRODUCT: "/product/get_all",
      GET_PRODUCT_BY_ID: "/product/get_by_id/{id}",
      CREATE_PRODUCT: "/product/create",
      UPDATE_PRODUCT: "/product/update/{id}",
      DELETE_PRODUCT: "/product/delete/{id}",
      SEARCH_PRODUCT: "/product/search",
      FILTER_PRODUCT: "/product/filter",
      GET_BY_CATEGORY: "/product/get_by_category/{categoryId}",
      SORT_PRODUCT_BY_PRICE_ASC: "/product/sort/price_asc",
      SORT_PRODUCT_BY_PRICE_DESC: "/product/sort/price_desc",
      SORT_PRODUCT_BY_NEWEST: "/product/sort/newest",
      COUNT_PRODUCT_BY_FILTER: "/product/count_by_filter",
    },

    ORDER_API: {
      GET_ALL_ORDER: "/order/get_all",
      GET_ORDER_BY_ID: "/order/get_by_id/{id}",
      CREATE_ORDER: "/order/create",
      UPDATE_ORDER: "/order/update/{id}",
      DELETE_ORDER: "/order/delete/{id}",
      GET_MY_ORDERS: "/order/my_orders",
      SEARCH_ORDER: "/order/search",
      FILTER_ORDER: "/order/filter",
      CANCEL_ORDER: "/order/cancel/{id}",
      TRACK_ORDER: "/order/track",
    },

    DASHBOARD_API: {
      GET_TOTAL_PRODUCTS: "/dashboard/total_products",
      GET_TOTAL_PRODUCTS_SOLD: "/dashboard/total_products_sold",
      GET_TOTAL_REVENUE: "/dashboard/total_revenue",
      GET_TOTAL_ORDERS: "/dashboard/total_orders",
      GET_TOTAL_CUSTOMERS: "/dashboard/total_customers",
      GET_REVENUE_BY_MONTH: "/dashboard/revenue_by_month",
      GET_REVENUE_BY_CATEGORY: "/dashboard/revenue_by_category",
      GET_RECENT_ORDERS: "/dashboard/recent_orders",
      GET_RECENT_PRODUCTS: "/dashboard/recent_products",
      GET_TOP_PRODUCTS: "/dashboard/top_products",
      GET_RECENT_CUSTOMERS: "/dashboard/recent_customers",
    },

    NOTIFICATION_API: {
      GET_ALL_NOTIFICATIONS: "/notification/get_all",
      GET_UNREAD_NOTIFICATIONS: "/notification/unread",
      MARK_AS_READ: "/notification/mark_as_read/{id}",
      MARK_ALL_AS_READ: "/notification/mark_all_as_read",
    },

    BANNER_API: {
      GET_ALL_BANNER: "/banner/get_all",
      GET_BANNER_BY_ID: "/banner/get_by_id/{id}",
      CREATE_BANNER: "/banner/create",
      UPDATE_BANNER: "/banner/update/{id}",
      DELETE_BANNER: "/banner/delete/{id}",
      SEARCH_BANNER: "/banner/search",
      FILTER_BANNER: "/banner/filter",
  },

    NEWS_API: {
      GET_ALL_NEWS: "/news/get_all",
      GET_NEWS_BY_ID: "/news/get_by_id/{id}",
      CREATE_NEWS: "/news/create",
      UPDATE_NEWS: "/news/update/{id}",
      DELETE_NEWS: "/news/delete/{id}",
      SEARCH_NEWS: "/news/search",
      FILTER_NEWS: "/news/filter",
    },

}

export default api_constant;