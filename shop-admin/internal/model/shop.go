package model

import (
	"time"
)

// TypeList 店铺类型枚举
type TypeList string

// 店铺类型常量
const (
	TypeListRetail     TypeList = "retail"
	TypeListRestaurant TypeList = "restaurant"
	TypeListService    TypeList = "service"
	TypeListOther      TypeList = "other"
)

// Shop 店铺模型
type Shop struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Email       string    `gorm:"size:255" json:"email"`
	Address     string    `gorm:"size:255" json:"address"`
	Type        TypeList  `gorm:"size:50" json:"type"`
	Contact     string    `gorm:"size:255" json:"contact"`
	Rating      *float64  `json:"rating"`
	Latitude    *float64  `json:"latitude"`
	Longitude   *float64  `json:"longitude"`
	OtherInfo   string    `gorm:"column:other_info;type:text" json:"otherInfo"`
	ImageBase64 string    `gorm:"column:image_base64;type:text" json:"imageBase64"`
	Description string    `gorm:"type:text" json:"description"`
	Phone       string    `gorm:"size:20" json:"phone"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// TableName 指定表名
func (Shop) TableName() string {
	return "shops"
}
