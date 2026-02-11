package db

import (
	"log"
	"os"
	"shop-admin/internal/model"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitMySQL 初始化 MySQL 数据库连接
func InitMySQL(dsn string) (*gorm.DB, error) {
	// 配置GORM日志
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Debug,
			Colorful:      true,
		},
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
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
