package config

import (
	"os"
	"path/filepath"
	"runtime"

	"gopkg.in/yaml.v3"
)

// Config 配置结构体
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Port int
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	DSN string
}

// LoadConfig 加载配置
func LoadConfig() (*Config, error) {
	// 获取项目根目录
	_, b, _, _ := runtime.Caller(0)
	rootPath := filepath.Dir(filepath.Dir(b))
	configPath := filepath.Join(rootPath, "config", "config.yaml")

	file, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var config Config
	if err := yaml.Unmarshal(file, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
