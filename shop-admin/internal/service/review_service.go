package service

import (
	"shop-admin/internal/model"
	"shop-admin/internal/repository"
)

// ReviewService 评价服务接口
type ReviewService interface {
	CreateReview(review *model.Review) error
	UpdateReview(review *model.Review) error
	DeleteReview(id uint) error
	GetReviewByID(id uint) (*model.Review, error)
	ListReviews() ([]*model.Review, error)
	ListReviewsByProductID(productID uint) ([]*model.Review, error)
}

// reviewService 评价服务实现
type reviewService struct {
	repo repository.ReviewRepository
}

// NewReviewService 创建评价服务实例
func NewReviewService(repo repository.ReviewRepository) ReviewService {
	return &reviewService{repo: repo}
}

// CreateReview 创建评价
func (s *reviewService) CreateReview(review *model.Review) error {
	return s.repo.Create(review)
}

// UpdateReview 更新评价
func (s *reviewService) UpdateReview(review *model.Review) error {
	return s.repo.Update(review)
}

// DeleteReview 删除评价
func (s *reviewService) DeleteReview(id uint) error {
	return s.repo.Delete(id)
}

// GetReviewByID 根据ID获取评价
func (s *reviewService) GetReviewByID(id uint) (*model.Review, error) {
	return s.repo.GetByID(id)
}

// ListReviews 获取评价列表
func (s *reviewService) ListReviews() ([]*model.Review, error) {
	return s.repo.List()
}

// ListReviewsByProductID 根据商品ID获取评价列表
func (s *reviewService) ListReviewsByProductID(productID uint) ([]*model.Review, error) {
	return s.repo.ListByProductID(productID)
}
