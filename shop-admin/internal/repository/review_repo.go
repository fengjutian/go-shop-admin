package repository

import (
	"gorm.io/gorm"
	"shop-admin/internal/model"
)

// ReviewRepository 评价仓库接口
type ReviewRepository interface {
	Create(review *model.Review) error
	Update(review *model.Review) error
	Delete(id uint) error
	GetByID(id uint) (*model.Review, error)
	List() ([]*model.Review, error)
	ListByProductID(productID uint) ([]*model.Review, error)
}

// reviewRepository 评价仓库实现
type reviewRepository struct {
	db *gorm.DB
}

// NewReviewRepository 创建评价仓库实例
func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

// Create 创建评价
func (r *reviewRepository) Create(review *model.Review) error {
	return r.db.Create(review).Error
}

// Update 更新评价
func (r *reviewRepository) Update(review *model.Review) error {
	return r.db.Save(review).Error
}

// Delete 删除评价
func (r *reviewRepository) Delete(id uint) error {
	return r.db.Delete(&model.Review{}, id).Error
}

// GetByID 根据ID获取评价
func (r *reviewRepository) GetByID(id uint) (*model.Review, error) {
	var review model.Review
	err := r.db.First(&review, id).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

// List 获取评价列表
func (r *reviewRepository) List() ([]*model.Review, error) {
	var reviews []*model.Review
	err := r.db.Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

// ListByProductID 根据商品ID获取评价列表
func (r *reviewRepository) ListByProductID(productID uint) ([]*model.Review, error) {
	var reviews []*model.Review
	err := r.db.Where("product_id = ?", productID).Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}
