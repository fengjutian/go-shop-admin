package v1

import (
	"net/http"
	"shop-admin/internal/model"
	"shop-admin/internal/service"
	"shop-admin/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ReviewHandler 评价处理器
type ReviewHandler struct {
	service service.ReviewService
}

// NewReviewHandler 创建评价处理器实例
func NewReviewHandler(service service.ReviewService) *ReviewHandler {
	return &ReviewHandler{service: service}
}

// Create 创建评价
func (h *ReviewHandler) Create(c *gin.Context) {
	var review model.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.CreateReview(&review); err != nil {
		response.Error(c, http.StatusInternalServerError, "创建评价失败", err)
		return
	}

	response.Success(c, "创建评价成功", review)
}

// Update 更新评价
func (h *ReviewHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	var review model.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	review.ID = uint(id)
	if err := h.service.UpdateReview(&review); err != nil {
		response.Error(c, http.StatusInternalServerError, "更新评价失败", err)
		return
	}

	response.Success(c, "更新评价成功", review)
}

// Delete 删除评价
func (h *ReviewHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	if err := h.service.DeleteReview(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除评价失败", err)
		return
	}

	response.Success(c, "删除评价成功", nil)
}

// Get 获取评价详情
func (h *ReviewHandler) Get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	review, err := h.service.GetReviewByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取评价详情失败", err)
		return
	}

	response.Success(c, "获取评价详情成功", review)
}

// List 获取评价列表
func (h *ReviewHandler) List(c *gin.Context) {
	reviews, err := h.service.ListReviews()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取评价列表失败", err)
		return
	}

	response.Success(c, "获取评价列表成功", reviews)
}

// ListByProductID 根据商品ID获取评价列表
func (h *ReviewHandler) ListByProductID(c *gin.Context) {
	productID, err := strconv.ParseUint(c.Param("product_id"), 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误", err)
		return
	}

	reviews, err := h.service.ListReviewsByProductID(uint(productID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取评价列表失败", err)
		return
	}

	response.Success(c, "获取评价列表成功", reviews)
}
