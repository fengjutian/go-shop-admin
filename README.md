# Shop Admin API

Shop Admin API 是一个基于 Go 语言开发的电商后台管理系统 API。

## 功能特性

- 店铺管理：创建、更新、删除、查询店铺信息
- 商品管理：创建、更新、删除、查询商品信息，支持按店铺查询商品
- 评价管理：创建、更新、删除、查询评价信息，支持按商品查询评价

## 技术栈

- Go 1.20
- Gin 框架
- GORM 框架
- MySQL 数据库

## 目录结构

```
go-shop-admin/
 ├── shop-admin/
 │   ├── cmd/
 │   │   └── admin/
 │   │       └── main.go
 │   ├── config/
 │   │   ├── config.yaml
 │   │   └── config.go
 │   ├── internal/
 │   │   ├── api/
 │   │   │   └── v1/
 │   │   │       ├── shop_handler.go
 │   │   │       ├── product_handler.go
 │   │   │       └── review_handler.go
 │   │   ├── service/
 │   │   │   ├── shop_service.go
 │   │   │   ├── product_service.go
 │   │   │   └── review_service.go
 │   │   ├── repository/
 │   │   │   ├── shop_repo.go
 │   │   │   ├── product_repo.go
 │   │   │   └── review_repo.go
 │   │   ├── model/
 │   │   │   ├── shop.go
 │   │   │   ├── product.go
 │   │   │   └── review.go
 │   │   └── router/
 │   │       └── router.go
 │   ├── pkg/
 │   │   ├── db/
 │   │   │   └── mysql.go
 │   │   └── response/
 │   │       └── response.go
 │   ├── migrations/
 │   │   ├── 001_create_shop.sql
 │   │   ├── 002_create_product.sql
 │   │   └── 003_create_review.sql
 │   ├── go.mod
 │   └── README.md
 └── README.md
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/go-shop-admin.git
cd go-shop-admin
```

### 2. 配置数据库

1. 确保 MySQL 服务已经启动
2. 创建数据库：

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS shop_admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

3. 修改数据库连接配置：

编辑 `shop-admin/config/config.yaml` 文件，修改数据库连接信息：

```yaml
server:
  port: 8080

database:
  dsn: "root:your_password@tcp(localhost:3306)/shop_admin?charset=utf8mb4&parseTime=True&loc=Local"
```

### 3. 安装依赖

```bash
cd shop-admin
go mod tidy
```

### 4. 启动服务

```bash
go run ./cmd/admin
```

服务将在 `http://localhost:8080` 启动。

## API 文档

### 店铺 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/shops | 创建店铺 |
| PUT | /api/v1/shops/:id | 更新店铺 |
| DELETE | /api/v1/shops/:id | 删除店铺 |
| GET | /api/v1/shops/:id | 获取店铺详情 |
| GET | /api/v1/shops | 获取店铺列表 |

### 商品 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/products | 创建商品 |
| PUT | /api/v1/products/:id | 更新商品 |
| DELETE | /api/v1/products/:id | 删除商品 |
| GET | /api/v1/products/:id | 获取商品详情 |
| GET | /api/v1/products | 获取商品列表 |
| GET | /api/v1/products/shop/:shop_id | 根据店铺ID获取商品列表 |

### 评价 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/reviews | 创建评价 |
| PUT | /api/v1/reviews/:id | 更新评价 |
| DELETE | /api/v1/reviews/:id | 删除评价 |
| GET | /api/v1/reviews/:id | 获取评价详情 |
| GET | /api/v1/reviews | 获取评价列表 |
| GET | /api/v1/reviews/product/:product_id | 根据商品ID获取评价列表 |

## 数据库设计

### 1. 店铺表 (shops)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | bigint(20) unsigned | PRIMARY KEY, AUTO_INCREMENT | 店铺ID |
| name | varchar(255) | NOT NULL | 店铺名称 |
| address | varchar(255) | | 店铺地址 |
| phone | varchar(20) | | 店铺电话 |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 2. 商品表 (products)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | bigint(20) unsigned | PRIMARY KEY, AUTO_INCREMENT | 商品ID |
| name | varchar(255) | NOT NULL | 商品名称 |
| price | decimal(10,2) | NOT NULL | 商品价格 |
| stock | int(11) | NOT NULL | 商品库存 |
| shop_id | bigint(20) unsigned | NOT NULL, FOREIGN KEY | 店铺ID |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 3. 评价表 (reviews)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | bigint(20) unsigned | PRIMARY KEY, AUTO_INCREMENT | 评价ID |
| content | text | | 评价内容 |
| rating | int(11) | NOT NULL | 评价等级 |
| product_id | bigint(20) unsigned | NOT NULL, FOREIGN KEY | 商品ID |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

## 部署说明

### 1. 编译项目

```bash
cd shop-admin
go build -o shop-admin ./cmd/admin
```

### 2. 运行项目

```bash
./shop-admin
```

### 3. 配置环境变量

可以通过环境变量覆盖配置文件中的设置：

```bash
SHOP_ADMIN_PORT=8080 SHOP_ADMIN_DSN="root:password@tcp(localhost:3306)/shop_admin?charset=utf8mb4&parseTime=True&loc=Local" ./shop-admin
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件
