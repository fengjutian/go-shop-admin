package v1

import (
	"net/http"
	"shop-admin/internal/model"
	"shop-admin/internal/service"
	"shop-admin/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ShopHandler 店铺处理器
type ShopHandler struct {
	service service.ShopService
}

// NewShopHandler 创建店铺处理器实例
func NewShopHandler(service service.ShopService) *ShopHandler {
	return &ShopHandler{service: service}
}

// Create 创建店铺
func (h *ShopHandler) Create(c *gin.Context) {
	var shop model.Shop
	if err := c.ShouldBindJSON(&shop); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.CreateShop(&shop); err != nil {
		response.Error(c, http.StatusInternalServerError, "创建店铺失败", err)
		return
	}

	response.Success(c, "创建店铺成功", shop)
}

// Update 更新店铺
func (h *ShopHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	var shop model.Shop
	if err := c.ShouldBindJSON(&shop); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	shop.ID = uint(id)
	if err := h.service.UpdateShop(&shop); err != nil {
		response.Error(c, http.StatusInternalServerError, "更新店铺失败", err)
		return
	}

	response.Success(c, "更新店铺成功", shop)
}

// Delete 删除店铺
func (h *ShopHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.DeleteShop(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除店铺失败", err)
		return
	}

	response.Success(c, "删除店铺成功", nil)
}

// Get 获取店铺详情
func (h *ShopHandler) Get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	shop, err := h.service.GetShopByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取店铺详情失败", err)
		return
	}

	response.Success(c, "获取店铺详情成功", shop)
}

// List 获取店铺列表
func (h *ShopHandler) List(c *gin.Context) {
	// 获取分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	
	// 确保分页参数有效
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}
	
	shops, total, err := h.service.ListShopsWithPagination(page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取店铺列表失败", err)
		return
	}

	// 返回包含分页信息的响应
	response.Success(c, "获取店铺列表成功", gin.H{
		"data":  shops,
		"total": total,
	})
}
