# 电商后台管理系统

电商后台管理系统是一个基于 Go 语言和 React 开发的完整电商后台解决方案，包含后端 API 和前端管理界面。

## 功能特性

### 后端功能
- 店铺管理：创建、更新、删除、查询店铺信息，支持分页查询
- 商品管理：创建、更新、删除、查询商品信息，支持按店铺查询商品
- 评价管理：创建、更新、删除、查询评价信息，支持按商品查询评价
- 类型管理：管理店铺类型，支持按创建时间倒序查询

### 前端功能
- 店铺管理：可视化管理店铺信息，支持增删改查
- 商品管理：商品信息的管理和展示
- 评价管理：评价信息的查看和管理
- 类型管理：店铺类型的管理
- 地图展示：在高德地图上展示店铺位置，支持按类型显示不同颜色标记

## 技术栈

### 后端
- Go 1.20
- Gin 框架
- GORM 框架
- MySQL 数据库

### 前端
- React 18
- TypeScript
- Semi UI 组件库
- Axios
- 高德地图 API

## 目录结构

```
go-shop-admin/
 ├── shop-admin/           # 后端 API 项目
 │   ├── cmd/
 │   │   └── admin/
 │   │       └── main.go    # 后端入口文件
 │   ├── config/
 │   │   ├── config.yaml    # 配置文件
 │   │   └── config.go      # 配置加载
 │   ├── internal/
 │   │   ├── api/
 │   │   │   └── v1/        # API 处理器
 │   │   ├── service/       # 业务逻辑层
 │   │   ├── repository/    # 数据访问层
 │   │   ├── model/         # 数据模型
 │   │   └── router/        # 路由配置
 │   ├── pkg/
 │   │   ├── db/            # 数据库连接
 │   │   └── response/      # 响应处理
 │   ├── migrations/        # 数据库迁移文件
 │   ├── go.mod             # Go 模块文件
 │   └── README.md          # 后端说明文档
 ├── shop-admin-web/        # 前端管理界面
 │   ├── public/            # 静态资源
 │   ├── src/
 │   │   ├── components/    # 公共组件
 │   │   ├── pages/         # 页面组件
 │   │   ├── services/      # API 服务
 │   │   ├── App.tsx        # 应用入口
 │   │   └── main.tsx       # 渲染入口
 │   ├── package.json       # 前端依赖
 │   └── README.md          # 前端说明文档
 └── README.md              # 项目总说明文档
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

### 3. 启动后端服务

```bash
cd shop-admin
go mod tidy
go run ./cmd/admin
```

后端服务将在 `http://localhost:8080` 启动。

### 4. 启动前端服务

```bash
cd ../shop-admin-web
npm install
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

## API 文档

### 店铺 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/shops | 创建店铺 |
| PUT | /api/v1/shops/:id | 更新店铺 |
| DELETE | /api/v1/shops/:id | 删除店铺 |
| GET | /api/v1/shops/:id | 获取店铺详情 |
| GET | /api/v1/shops | 获取店铺列表（支持分页） |

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

### 类型 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/types | 创建类型 |
| PUT | /api/v1/types/:id | 更新类型 |
| DELETE | /api/v1/types/:id | 删除类型 |
| GET | /api/v1/types/:id | 获取类型详情 |
| GET | /api/v1/types | 获取类型列表（按创建时间倒序） |

## 数据库设计

### 1. 店铺表 (shops)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | bigint(20) unsigned | PRIMARY KEY, AUTO_INCREMENT | 店铺ID |
| name | varchar(255) | NOT NULL | 店铺名称 |
| email | varchar(255) | NOT NULL | 店铺邮箱 |
| address | varchar(255) | | 店铺地址 |
| type | varchar(50) | | 店铺类型 |
| contact | varchar(50) | | 联系人 |
| phone | varchar(20) | | 联系电话 |
| latitude | decimal(10,6) | | 纬度 |
| longitude | decimal(10,6) | | 经度 |
| rating | decimal(2,1) | | 评分 |
| description | text | | 店铺描述 |
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

### 4. 类型表 (types)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | bigint(20) unsigned | PRIMARY KEY, AUTO_INCREMENT | 类型ID |
| name | varchar(50) | NOT NULL | 类型名称 |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

## 部署说明

### 后端部署

1. 编译项目：

```bash
cd shop-admin
go build -o shop-admin ./cmd/admin
```

2. 运行项目：

```bash
./shop-admin
```

3. 配置环境变量：

```bash
SHOP_ADMIN_PORT=8080 SHOP_ADMIN_DSN="root:password@tcp(localhost:3306)/shop_admin?charset=utf8mb4&parseTime=True&loc=Local" ./shop-admin
```

### 前端部署

1. 构建项目：

```bash
cd shop-admin-web
npm run build
```

2. 部署构建产物：

将 `build` 目录下的文件部署到静态文件服务器或 CDN。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件