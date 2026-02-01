package main

import (
	"fmt"
	"shop-admin/config"
	"shop-admin/internal/router"
	"shop-admin/pkg/db"
)

func main() {
	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("加载配置失败: %v\n", err)
		return
	}

	// 初始化数据库
	db, err := db.InitMySQL(cfg.Database.DSN)
	if err != nil {
		fmt.Printf("初始化数据库失败: %v\n", err)
		return
	}

	// 初始化路由
	r := router.SetupRouter(db)

	// 启动服务
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	fmt.Printf("服务启动在 http://localhost%s\n", addr)
	if err := r.Run(addr); err != nil {
		fmt.Printf("启动服务失败: %v\n", err)
		return
	}
}
