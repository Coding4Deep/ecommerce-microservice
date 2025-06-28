package com.ecommerce.product.model;

import java.math.BigDecimal;

public class Dimensions {
    private BigDecimal length;
    private BigDecimal width;
    private BigDecimal height;
    private String unit = "cm";
    
    // Constructors
    public Dimensions() {}
    
    public Dimensions(BigDecimal length, BigDecimal width, BigDecimal height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }
    
    public Dimensions(BigDecimal length, BigDecimal width, BigDecimal height, String unit) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.unit = unit;
    }
    
    // Getters and Setters
    public BigDecimal getLength() { 
        return length; 
    }
    
    public void setLength(BigDecimal length) { 
        this.length = length; 
    }
    
    public BigDecimal getWidth() { 
        return width; 
    }
    
    public void setWidth(BigDecimal width) { 
        this.width = width; 
    }
    
    public BigDecimal getHeight() { 
        return height; 
    }
    
    public void setHeight(BigDecimal height) { 
        this.height = height; 
    }
    
    public String getUnit() { 
        return unit; 
    }
    
    public void setUnit(String unit) { 
        this.unit = unit; 
    }
    
    @Override
    public String toString() {
        return length + "x" + width + "x" + height + " " + unit;
    }
}
