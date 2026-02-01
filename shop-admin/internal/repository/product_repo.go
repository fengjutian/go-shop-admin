package repository

import (
	"gorm.io/gorm"
	"shop-admin/internal/model"
)

// ProductRepository 商品仓库接口
type ProductRepository interface {
	Create(product *model.Product) error
	Update(product *model.Product) error
	Delete(id uint) error
	GetByID(id uint) (*model.Product, error)
	List() ([]*model.Product, error)
	ListByShopID(shopID uint) ([]*model.Product, error)
}

// productRepository 商品仓库实现
type productRepository struct {
	db *gorm.DB
}

// NewProductRepository 创建商品仓库实例
func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

// Create 创建商品
func (r *productRepository) Create(product *model.Product) error {
	return r.db.Create(product).Error
}

// Update 更新商品
func (r *productRepository) Update(product *model.Product) error {
	return r.db.Save(product).Error
}

// Delete 删除商品
func (r *productRepository) Delete(id uint) error {
	return r.db.Delete(&model.Product{}, id).Error
}

// GetByID 根据ID获取商品
func (r *productRepository) GetByID(id uint) (*model.Product, error) {
	var product model.Product
	err := r.db.First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

// List 获取商品列表
func (r *productRepository) List() ([]*model.Product, error) {
	var products []*model.Product
	err := r.db.Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

// ListByShopID 根据店铺ID获取商品列表
func (r *productRepository) ListByShopID(shopID uint) ([]*model.Product, error) {
	var products []*model.Product
	err := r.db.Where("shop_id = ?", shopID).Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}
