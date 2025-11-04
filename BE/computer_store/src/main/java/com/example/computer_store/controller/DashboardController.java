package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.DashboardResponse;
import com.example.computer_store.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOTAL_PRODUCTS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTotalProducts() {
        return dashboardService.getTotalProducts();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOTAL_PRODUCTS_SOLD)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTotalProductsSold() {
        return dashboardService.getTotalProductsSold();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOTAL_REVENUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTotalRevenue() {
        return dashboardService.getTotalRevenue();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOTAL_ORDERS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTotalOrders() {
        return dashboardService.getTotalOrders();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOTAL_CUSTOMERS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTotalCustomers() {
        return dashboardService.getTotalCustomers();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_REVENUE_BY_MONTH)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getRevenueByMonth() {
        return dashboardService.getRevenueByMonth();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_REVENUE_BY_CATEGORY)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getRevenueByCategory() {
        return dashboardService.getRevenueByCategory();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_RECENT_ORDERS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getRecentOrders() {
        return dashboardService.getRecentOrders();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_RECENT_PRODUCTS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getRecentProducts() {
        return dashboardService.getRecentProducts();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_TOP_PRODUCTS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getTopProducts() {
        return dashboardService.getTopProducts();
    }

    @GetMapping(URLConstant.DASHBOARD_API.GET_RECENT_CUSTOMERS)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseAPI<DashboardResponse> getRecentCustomers() {
        return dashboardService.getRecentCustomers();
    }
}