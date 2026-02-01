package repository

import (
	"gorm.io/gorm"
	"shop-admin/internal/model"
)

// ShopRepository 店铺仓库接口
type ShopRepository interface {
	Create(shop *model.Shop) error
	Update(shop *model.Shop) error
	Delete(id uint) error
	GetByID(id uint) (*model.Shop, error)
	List() ([]*model.Shop, error)
}

// shopRepository 店铺仓库实现
type shopRepository struct {
	db *gorm.DB
}

// NewShopRepository 创建店铺仓库实例
func NewShopRepository(db *gorm.DB) ShopRepository {
	return &shopRepository{db: db}
}

// Create 创建店铺
func (r *shopRepository) Create(shop *model.Shop) error {
	return r.db.Create(shop).Error
}

// Update 更新店铺
func (r *shopRepository) Update(shop *model.Shop) error {
	return r.db.Save(shop).Error
}

// Delete 删除店铺
func (r *shopRepository) Delete(id uint) error {
	return r.db.Delete(&model.Shop{}, id).Error
}

// GetByID 根据ID获取店铺
func (r *shopRepository) GetByID(id uint) (*model.Shop, error) {
	var shop model.Shop
	err := r.db.First(&shop, id).Error
	if err != nil {
		return nil, err
	}
	return &shop, nil
}

// List 获取店铺列表
func (r *shopRepository) List() ([]*model.Shop, error) {
	var shops []*model.Shop
	err := r.db.Find(&shops).Error
	if err != nil {
		return nil, err
	}
	return shops, nil
}
