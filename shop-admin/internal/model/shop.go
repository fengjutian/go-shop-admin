package model

import (
	"time"
)

// Shop 店铺模型
type Shop struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Address   string    `gorm:"size:255" json:"address"`
	Phone     string    `gorm:"size:20" json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名
func (Shop) TableName() string {
	return "shops"
}
