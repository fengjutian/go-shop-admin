package router

import (
	"gorm.io/gorm"
	"shop-admin/internal/api/v1"
	"shop-admin/internal/repository"
	"shop-admin/internal/service"

	"github.com/gin-gonic/gin"
)

// SetupRouter 设置路由
func SetupRouter(db *gorm.DB) *gin.Engine {
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

	// 初始化服务
	shopService := service.NewShopService(shopRepo)
	productService := service.NewProductService(productRepo)
	reviewService := service.NewReviewService(reviewRepo)

	// 初始化处理器
	shopHandler := v1.NewShopHandler(shopService)
	productHandler := v1.NewProductHandler(productService)
	reviewHandler := v1.NewReviewHandler(reviewService)

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
	}

	return r
}
