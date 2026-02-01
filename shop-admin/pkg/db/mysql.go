package db

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"shop-admin/internal/model"
)

// InitMySQL 初始化 MySQL 数据库连接
func InitMySQL(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// 自动迁移模型
	err = db.AutoMigrate(
		&model.Shop{},
		&model.Product{},
		&model.Review{},
	)
	if err != nil {
		return nil, err
	}

	return db, nil
}
