package service

import (
	"shop-admin/internal/model"
	"shop-admin/internal/repository"
)

// ProductService 商品服务接口
type ProductService interface {
	CreateProduct(product *model.Product) error
	UpdateProduct(product *model.Product) error
	DeleteProduct(id uint) error
	GetProductByID(id uint) (*model.Product, error)
	ListProducts() ([]*model.Product, error)
	ListProductsByShopID(shopID uint) ([]*model.Product, error)
}

// productService 商品服务实现
type productService struct {
	repo repository.ProductRepository
}

// NewProductService 创建商品服务实例
func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

// CreateProduct 创建商品
func (s *productService) CreateProduct(product *model.Product) error {
	return s.repo.Create(product)
}

// UpdateProduct 更新商品
func (s *productService) UpdateProduct(product *model.Product) error {
	return s.repo.Update(product)
}

// DeleteProduct 删除商品
func (s *productService) DeleteProduct(id uint) error {
	return s.repo.Delete(id)
}

// GetProductByID 根据ID获取商品
func (s *productService) GetProductByID(id uint) (*model.Product, error) {
	return s.repo.GetByID(id)
}

// ListProducts 获取商品列表
func (s *productService) ListProducts() ([]*model.Product, error) {
	return s.repo.List()
}

// ListProductsByShopID 根据店铺ID获取商品列表
func (s *productService) ListProductsByShopID(shopID uint) ([]*model.Product, error) {
	return s.repo.ListByShopID(shopID)
}
