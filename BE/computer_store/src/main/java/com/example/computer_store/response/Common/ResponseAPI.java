package com.example.computer_store.response.Common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

public class ResponseAPI<T> {
    private int status;
    private String message;
    private T data;

    private List<String> type;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private Integer totalRecords;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private Integer totalPage;

    public ResponseAPI() {
    }

    public ResponseAPI(int status, String message, T data, Integer totalRecords) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.totalRecords = totalRecords;
    }

    public ResponseAPI(int status, String message, T data, Integer totalRecords, Integer totalPage) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.totalRecords = totalRecords;
        this.totalPage = totalPage;
    }
    public ResponseAPI( T data, int totalRecords, int totalPage) {
        this.data = data;
        this.totalRecords = totalRecords;
        this.totalPage = totalPage;
    }

    public ResponseAPI(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ResponseAPI(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResponseAPI(int status, String message, T data, List<String> type) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.type = type;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(Integer totalRecords) {
        this.totalRecords = totalRecords;
    }

    public Integer getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(Integer totalPage) {
        this.totalPage = totalPage;
    }

    public List<String> getType() {
        return type;
    }

    public void setType(List<String> type) {
        this.type = type;
    }

}
