package com.netblocker.backend.dto;

public class AccessLogRequest {
    private String url;
    private String status;

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
