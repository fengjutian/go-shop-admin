# Shop Admin API

Shop Admin API 是一个基于 Go 语言开发的电商后台管理系统 API。

## 功能特性

- 店铺管理
- 商品管理
- 评价管理

## 技术栈

- Go 1.20
- Gin 框架
- GORM 框架
- MySQL 数据库

## 目录结构

```
shop-admin/
 ├── cmd/
 │ └── admin/
 │ └── main.go
 ├── config/
 │ ├── config.yaml
 │ └── config.go
 ├── internal/
 │ ├── api/
 │ │ └── v1/
 │ │ ├── shop_handler.go
 │ │ ├── product_handler.go
 │ │ └── review_handler.go
 │ ├── service/
 │ │ ├── shop_service.go
 │ │ ├── product_service.go
 │ │ └── review_service.go
 │ ├── repository/
 │ │ ├── shop_repo.go
 │ │ ├── product_repo.go
 │ │ └── review_repo.go
 │ ├── model/
 │ │ ├── shop.go
 │ │ ├── product.go
 │ │ └── review.go
 │ └── router/
 │ └── router.go
 ├── pkg/
 │ ├── db/
 │ │ └── mysql.go
 │ └── response/
 │ └── response.go
 ├── migrations/
 │ ├── 001_create_shop.sql
 │ ├── 002_create_product.sql
 │ └── 003_create_review.sql
 ├── go.mod
 └── README.md
```

## 快速开始

1. 克隆仓库
2. 配置数据库连接
3. 运行数据库迁移
4. 启动服务

```bash
# 启动服务
cd cmd/admin
go run main.go
```
