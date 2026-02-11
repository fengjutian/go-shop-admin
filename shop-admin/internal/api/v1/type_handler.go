package v1

import (
	"net/http"
	"shop-admin/internal/model"
	"shop-admin/internal/service"
	"shop-admin/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

// TypeHandler 类型处理器
type TypeHandler struct {
	service service.TypeService
}

// NewTypeHandler 创建类型处理器实例
func NewTypeHandler(service service.TypeService) *TypeHandler {
	return &TypeHandler{service: service}
}

// RegisterRoutes 注册路由
func (h *TypeHandler) RegisterRoutes(router *gin.RouterGroup) {
	types := router.Group("/types")
	{
		types.POST("", h.Create)
		types.PUT("/:id", h.Update)
		types.DELETE("/:id", h.Delete)
		types.GET("/:id", h.Get)
		types.GET("", h.List)
	}
}

// Create 创建类型
func (h *TypeHandler) Create(c *gin.Context) {
	var shopType model.ShopType
	if err := c.ShouldBindJSON(&shopType); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.CreateType(&shopType); err != nil {
		if err.Error() == "type name already exists" {
			response.Error(c, http.StatusBadRequest, "类型名称已存在", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "创建类型失败", err)
		return
	}

	response.Success(c, "创建类型成功", shopType)
}

// Update 更新类型
func (h *TypeHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	var shopType model.ShopType
	if err := c.ShouldBindJSON(&shopType); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	shopType.ID = uint(id)
	if err := h.service.UpdateType(&shopType); err != nil {
		if err.Error() == "type not found" {
			response.Error(c, http.StatusNotFound, "类型不存在", err)
			return
		}
		if err.Error() == "type name already exists" {
			response.Error(c, http.StatusBadRequest, "类型名称已存在", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "更新类型失败", err)
		return
	}

	response.Success(c, "更新类型成功", shopType)
}

// Delete 删除类型
func (h *TypeHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.DeleteType(uint(id)); err != nil {
		if err.Error() == "type not found" {
			response.Error(c, http.StatusNotFound, "类型不存在", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "删除类型失败", err)
		return
	}

	response.Success(c, "删除类型成功", nil)
}

// Get 获取类型详情
func (h *TypeHandler) Get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	shopType, err := h.service.GetType(uint(id))
	if err != nil {
		if err.Error() == "type not found" {
			response.Error(c, http.StatusNotFound, "类型不存在", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "获取类型失败", err)
		return
	}

	response.Success(c, "获取类型成功", shopType)
}

// List 获取类型列表
func (h *TypeHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	types, err := h.service.ListTypes()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取类型列表失败", err)
		return
	}

	// 计算分页
	total := len(types)
	start := (page - 1) * pageSize
	end := start + pageSize
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}
	
	// 确保start不小于0
	if start < 0 {
		start = 0
	}
	
	pagedTypes := types[start:end]

	response.Success(c, "获取类型列表成功", map[string]interface{}{
		"data":  pagedTypes,
		"total": total,
	})
}
