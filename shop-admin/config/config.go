package config

import (
	"gopkg.in/yaml.v3"
	"os"
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
	file, err := os.ReadFile("config/config.yaml")
	if err != nil {
		return nil, err
	}

	var config Config
	if err := yaml.Unmarshal(file, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
