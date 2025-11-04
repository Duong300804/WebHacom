package com.example.computer_store.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class DashboardResponse {
    private long total;
    private List<RevenueByMonth> revenueByMonth;
    private List<RevenueByCategory> revenueByCategory;
    private List<RecentOrder> recentOrders;
    private List<RecentProduct> recentProducts;
    private List<TopProduct> topProducts;
    private List<RecentCustomer> recentCustomers;
    private Map<Long, String> userNames;

    @Data
    public static class RevenueByMonth {
        private String month;
        private long revenue;
    }

    @Data
    public static class RevenueByCategory {
        private String categoryName;
        private long revenue;
        private double percentage;
    }

    @Data
    public static class RecentOrder {
        private long id;
        private long userId;
        private long totalAmount;
        private String orderDateFormatted;
        private String status;
        private String userName;
    }

    @Data
    public static class RecentProduct {
        private long id;
        private String name;
        private String priceFormatted;
        private List<Image> images;

        @Data
        public static class Image {
            private String imageUrl;
            private boolean main;
        }
    }

    @Data
    public static class TopProduct {
        private long id;
        private String name;
        private long soldQuantity;
        private long totalRevenue;
        private List<RecentProduct.Image> images;
    }

    @Data
    public static class RecentCustomer {
        private long id;
        private String fullName;
        private LocalDate createDate;
    }
}