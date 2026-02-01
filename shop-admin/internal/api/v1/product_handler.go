package v1

import (
	"net/http"
	"shop-admin/internal/model"
	"shop-admin/internal/service"
	"shop-admin/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ProductHandler 商品处理器
type ProductHandler struct {
	service service.ProductService
}

// NewProductHandler 创建商品处理器实例
func NewProductHandler(service service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

// Create 创建商品
func (h *ProductHandler) Create(c *gin.Context) {
	var product model.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.CreateProduct(&product); err != nil {
		response.Error(c, http.StatusInternalServerError, "创建商品失败", err)
		return
	}

	response.Success(c, "创建商品成功", product)
}

// Update 更新商品
func (h *ProductHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	var product model.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	product.ID = uint(id)
	if err := h.service.UpdateProduct(&product); err != nil {
		response.Error(c, http.StatusInternalServerError, "更新商品失败", err)
		return
	}

	response.Success(c, "更新商品成功", product)
}

// Delete 删除商品
func (h *ProductHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.DeleteProduct(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除商品失败", err)
		return
	}

	response.Success(c, "删除商品成功", nil)
}

// Get 获取商品详情
func (h *ProductHandler) Get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	product, err := h.service.GetProductByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取商品详情失败", err)
		return
	}

	response.Success(c, "获取商品详情成功", product)
}

// List 获取商品列表
func (h *ProductHandler) List(c *gin.Context) {
	products, err := h.service.ListProducts()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取商品列表失败", err)
		return
	}

	response.Success(c, "获取商品列表成功", products)
}

// ListByShopID 根据店铺ID获取商品列表
func (h *ProductHandler) ListByShopID(c *gin.Context) {
	shopID, err := strconv.ParseUint(c.Param("shop_id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	products, err := h.service.ListProductsByShopID(uint(shopID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取商品列表失败", err)
		return
	}

	response.Success(c, "获取商品列表成功", products)
}
