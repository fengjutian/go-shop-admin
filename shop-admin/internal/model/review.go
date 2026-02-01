package model

import (
	"time"
)

// Review 评价模型
type Review struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `gorm:"size:1000" json:"content"`
	Rating    int       `gorm:"not null" json:"rating"`
	ProductID uint      `gorm:"not null" json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名
func (Review) TableName() string {
	return "reviews"
}
