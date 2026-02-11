package router

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	v1 "shop-admin/internal/api/v1"
	"shop-admin/internal/model"
	"shop-admin/internal/repository"
	"shop-admin/internal/service"
	"strconv"
	"strings"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

// InitShopData 初始化店铺数据
func InitShopData(db *gorm.DB) error {
	// 检查是否已有数据
	var count int64
	if err := db.Model(&model.Shop{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		fmt.Println("Shop data already exists, skipping import")
		return nil
	}

	// 读取SQL文件
	sqlFile := "d:/GitHub/go-shop-admin/sql/all-business-data-complete.sql"
	file, err := os.Open(sqlFile)
	if err != nil {
		return fmt.Errorf("failed to open SQL file: %w", err)
	}
	defer file.Close()

	// 解析SQL语句
	var shops []model.Shop
	scanner := bufio.NewScanner(file)
	var currentInsert []string
	inInsert := false

	for scanner.Scan() {
		line := scanner.Text()
		line = strings.TrimSpace(line)

		if strings.HasPrefix(line, "INSERT INTO Business") {
			inInsert = true
			currentInsert = []string{}
		} else if inInsert {
			currentInsert = append(currentInsert, line)
			if strings.HasSuffix(line, ");") {
				inInsert = false
				// 解析当前INSERT语句
				shop, err := parseInsertStatement(currentInsert)
				if err == nil {
					shops = append(shops, shop)
					// 每100条批量插入一次
					if len(shops) >= 100 {
						if err := db.Create(&shops).Error; err != nil {
							return fmt.Errorf("failed to insert batch: %w", err)
						}
						fmt.Printf("Inserted %d shops\n", len(shops))
						shops = []model.Shop{}
					}
				}
			}
		}
	}

	// 插入剩余的记录
	if len(shops) > 0 {
		if err := db.Create(&shops).Error; err != nil {
			return fmt.Errorf("failed to insert remaining: %w", err)
		}
		fmt.Printf("Inserted %d shops\n", len(shops))
	}

	fmt.Println("Shop data import completed successfully!")
	return nil
}

// parseInsertStatement 解析INSERT语句
func parseInsertStatement(lines []string) (model.Shop, error) {
	var shop model.Shop

	// 合并所有行
	fullStmt := strings.Join(lines, " ")
	fullStmt = strings.ReplaceAll(fullStmt, "\n", " ")
	fullStmt = strings.ReplaceAll(fullStmt, "\t", " ")

	// 提取VALUES部分
	valuesRegex := regexp.MustCompile(`VALUES\s*\((.*?)\)\s*;`)
	matches := valuesRegex.FindStringSubmatch(fullStmt)
	if len(matches) < 2 {
		return shop, fmt.Errorf("no values found")
	}

	// 分割值
	valuesPart := matches[1]
	// 处理单引号内的逗号
	var values []string
	var currentValue strings.Builder
	inQuotes := false
	quoteChar := byte(0)

	for i := 0; i < len(valuesPart); i++ {
		char := valuesPart[i]

		if char == '\'' || char == '"' {
			if !inQuotes {
				inQuotes = true
				quoteChar = char
				currentValue.WriteByte(char)
			} else if char == quoteChar {
				// 检查是否是转义的引号
				escaped := false
				if i > 0 && valuesPart[i-1] == '\\' {
					escaped = true
				}
				if !escaped {
					inQuotes = false
					quoteChar = 0
				}
				currentValue.WriteByte(char)
			} else {
				currentValue.WriteByte(char)
			}
		} else if char == ',' && !inQuotes {
			values = append(values, strings.TrimSpace(currentValue.String()))
			currentValue.Reset()
		} else {
			currentValue.WriteByte(char)
		}
	}

	// 添加最后一个值
	if currentValue.Len() > 0 {
		values = append(values, strings.TrimSpace(currentValue.String()))
	}

	// 解析值
	if len(values) >= 11 {
		// 移除引号
		stripQuotes := func(s string) string {
			s = strings.Trim(s, "'\"")
			return s
		}

		shop.Name = stripQuotes(values[0])
		shop.Email = stripQuotes(values[1])
		shop.Address = stripQuotes(values[2])

		// 映射中文类型到枚举值
		typeStr := stripQuotes(values[3])
		switch typeStr {
		case "景点":
			shop.Type = model.TypeListOther
		case "糕点":
			shop.Type = model.TypeListRetail
		case "银行":
			shop.Type = model.TypeListService
		case "烧烤":
			shop.Type = model.TypeListRestaurant
		case "美容":
			shop.Type = model.TypeListService
		case "棋牌":
			shop.Type = model.TypeListService
		case "中餐":
			shop.Type = model.TypeListRestaurant
		case "餐饮":
			shop.Type = model.TypeListRestaurant
		default:
			shop.Type = model.TypeListOther
		}

		shop.Contact = stripQuotes(values[4])

		// 解析rating
		if values[5] != "NULL" {
			rating, err := strconv.ParseFloat(stripQuotes(values[5]), 64)
			if err == nil {
				shop.Rating = &rating
			}
		}

		// 解析latitude
		if values[6] != "NULL" {
			latitude, err := strconv.ParseFloat(stripQuotes(values[6]), 64)
			if err == nil {
				shop.Latitude = &latitude
			}
		}

		// 解析longitude
		if values[7] != "NULL" {
			longitude, err := strconv.ParseFloat(stripQuotes(values[7]), 64)
			if err == nil {
				shop.Longitude = &longitude
			}
		}

		// otherInfo
		if values[8] != "NULL" {
			shop.OtherInfo = stripQuotes(values[8])
		}

		// imageBase64
		if values[9] != "NULL" {
			shop.ImageBase64 = stripQuotes(values[9])
		}

		// description
		if values[10] != "NULL" {
			shop.Description = stripQuotes(values[10])
		}
	}

	return shop, nil
}

// SetupRouter 设置路由
func SetupRouter(db *gorm.DB) *gin.Engine {
	// 初始化店铺数据
	if err := InitShopData(db); err != nil {
		fmt.Printf("Failed to initialize shop data: %v\n", err)
	}

	r := gin.Default()

	// 添加 CORS 中间件
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 初始化仓库
	shopRepo := repository.NewShopRepository(db)
	productRepo := repository.NewProductRepository(db)
	reviewRepo := repository.NewReviewRepository(db)
	typeRepo := repository.NewTypeRepository(db)

	// 初始化服务
	shopService := service.NewShopService(shopRepo)
	productService := service.NewProductService(productRepo)
	reviewService := service.NewReviewService(reviewRepo)
	typeService := service.NewTypeService(typeRepo)

	// 初始化处理器
	shopHandler := v1.NewShopHandler(shopService)
	productHandler := v1.NewProductHandler(productService)
	reviewHandler := v1.NewReviewHandler(reviewService)
	typeHandler := v1.NewTypeHandler(typeService)

	// API 路由组
	api := r.Group("/api/v1")
	{
		// 店铺路由
		shops := api.Group("/shops")
		{
			shops.POST("", shopHandler.Create)
			shops.PUT("/:id", shopHandler.Update)
			shops.DELETE("/:id", shopHandler.Delete)
			shops.GET("/:id", shopHandler.Get)
			shops.GET("", shopHandler.List)
		}

		// 商品路由
		products := api.Group("/products")
		{
			products.POST("", productHandler.Create)
			products.PUT("/:id", productHandler.Update)
			products.DELETE("/:id", productHandler.Delete)
			products.GET("/:id", productHandler.Get)
			products.GET("", productHandler.List)
			products.GET("/shop/:shop_id", productHandler.ListByShopID)
		}

		// 评价路由
		reviews := api.Group("/reviews")
		{
			reviews.POST("", reviewHandler.Create)
			reviews.PUT("/:id", reviewHandler.Update)
			reviews.DELETE("/:id", reviewHandler.Delete)
			reviews.GET("/:id", reviewHandler.Get)
			reviews.GET("", reviewHandler.List)
			reviews.GET("/product/:product_id", reviewHandler.ListByProductID)
		}

		// 类型路由
		types := api.Group("/types")
		{
			types.POST("", typeHandler.Create)
			types.PUT("/:id", typeHandler.Update)
			types.DELETE("/:id", typeHandler.Delete)
			types.GET("/:id", typeHandler.Get)
			types.GET("", typeHandler.List)
		}
	}

	return r
}
