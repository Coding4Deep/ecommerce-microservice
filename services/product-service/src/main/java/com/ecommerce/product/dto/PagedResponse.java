package com.ecommerce.product.dto;

import java.util.List;

public class PagedResponse<T> {
    
    private List<T> content;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;
    private Boolean first;
    private Boolean last;
    private Boolean hasNext;
    private Boolean hasPrevious;
    
    // Constructors
    public PagedResponse() {}
    
    public PagedResponse(List<T> content, Integer page, Integer size, Long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
        this.first = page == 0;
        this.last = page >= totalPages - 1;
        this.hasNext = page < totalPages - 1;
        this.hasPrevious = page > 0;
    }
    
    // Static factory methods
    public static <T> PagedResponse<T> of(List<T> content, Integer page, Integer size, Long totalElements) {
        return new PagedResponse<>(content, page, size, totalElements);
    }
    
    public static <T> PagedResponse<T> empty(Integer page, Integer size) {
        return new PagedResponse<>(List.of(), page, size, 0L);
    }
    
    // Getters and Setters
    public List<T> getContent() {
        return content;
    }
    
    public void setContent(List<T> content) {
        this.content = content;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
    
    public Long getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }
    
    public Integer getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }
    
    public Boolean getFirst() {
        return first;
    }
    
    public void setFirst(Boolean first) {
        this.first = first;
    }
    
    public Boolean getLast() {
        return last;
    }
    
    public void setLast(Boolean last) {
        this.last = last;
    }
    
    public Boolean getHasNext() {
        return hasNext;
    }
    
    public void setHasNext(Boolean hasNext) {
        this.hasNext = hasNext;
    }
    
    public Boolean getHasPrevious() {
        return hasPrevious;
    }
    
    public void setHasPrevious(Boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
    
    // Utility methods
    public boolean isEmpty() {
        return content == null || content.isEmpty();
    }
    
    public int getNumberOfElements() {
        return content != null ? content.size() : 0;
    }
}
