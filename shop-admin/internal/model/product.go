package model

import (
	"time"
)

// Product 商品模型
type Product struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Price     float64   `gorm:"not null" json:"price"`
	Stock     int       `gorm:"not null" json:"stock"`
	ShopID    uint      `gorm:"not null" json:"shop_id"`
	Shop      Shop      `gorm:"foreignKey:ShopID" json:"shop"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名
func (Product) TableName() string {
	return "products"
}
