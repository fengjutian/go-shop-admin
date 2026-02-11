package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"shop-admin/internal/model"
)

func main() {
	// 数据库连接
	dsn := "root:fjt911008@tcp(localhost:3306)/shop_admin?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}

	// 自动迁移表结构
	if err := db.AutoMigrate(&model.Shop{}); err != nil {
		fmt.Printf("Failed to migrate database: %v\n", err)
		return
	}

	// 读取SQL文件
	sqlFile := filepath.Join("d:\", "GitHub", "go-shop-admin", "sql", "all-business-data-complete.sql")
	file, err := os.Open(sqlFile)
	if err != nil {
		fmt.Printf("Failed to open SQL file: %v\n", err)
		return
	}
	defer file.Close()

	// 解析SQL语句
	var shops []model.Shop
	scanner := bufio.NewScanner(file)
	var currentInsert []string
	inInsert := false

	for scanner.Scan() {
		line := scanner.Text()
		line = strings.TrimSpace(line)

		if strings.HasPrefix(line, "INSERT INTO Business") {
			inInsert = true
			currentInsert = []string{}
		} else if inInsert {
			currentInsert = append(currentInsert, line)
			if strings.HasSuffix(line, ");") {
				inInsert = false
				// 解析当前INSERT语句
				shop, err := parseInsertStatement(currentInsert)
				if err == nil {
					shops = append(shops, shop)
					// 每100条批量插入一次
					if len(shops) >= 100 {
						if err := db.Create(&shops).Error; err != nil {
							fmt.Printf("Failed to insert batch: %v\n", err)
						} else {
							fmt.Printf("Inserted %d shops\n", len(shops))
						}
						shops = []model.Shop{}
					}
				}
			}
		}
	}

	// 插入剩余的记录
	if len(shops) > 0 {
		if err := db.Create(&shops).Error; err != nil {
			fmt.Printf("Failed to insert remaining: %v\n", err)
		} else {
			fmt.Printf("Inserted %d shops\n", len(shops))
		}
	}

	fmt.Println("Data import completed!")
}

func parseInsertStatement(lines []string) (model.Shop, error) {
	var shop model.Shop

	// 合并所有行
	fullStmt := strings.Join(lines, " ")
	fullStmt = strings.ReplaceAll(fullStmt, "\n", " ")
	fullStmt = strings.ReplaceAll(fullStmt, "\t", " ")

	// 提取VALUES部分
	valuesRegex := regexp.MustCompile(`VALUES\s*\((.*?)\)\s*;`)
	matches := valuesRegex.FindStringSubmatch(fullStmt)
	if len(matches) < 2 {
		return shop, fmt.Errorf("no values found")
	}

	// 分割值
	valuesPart := matches[1]
	// 处理单引号内的逗号
	var values []string
	var currentValue strings.Builder
	inQuotes := false
	quoteChar := byte(0)

	for i := 0; i < len(valuesPart); i++ {
		char := valuesPart[i]

		if char == '\'' || char == '"' {
			if !inQuotes {
				inQuotes = true
				quoteChar = char
				currentValue.WriteByte(char)
			} else if char == quoteChar {
				// 检查是否是转义的引号
				escaped := false
				if i > 0 && valuesPart[i-1] == '\\' {
					escaped = true
				}
				if !escaped {
					inQuotes = false
					quoteChar = 0
				}
				currentValue.WriteByte(char)
			} else {
				currentValue.WriteByte(char)
			}
		} else if char == ',' && !inQuotes {
			values = append(values, strings.TrimSpace(currentValue.String()))
			currentValue.Reset()
		} else {
			currentValue.WriteByte(char)
		}
	}

	// 添加最后一个值
	if currentValue.Len() > 0 {
		values = append(values, strings.TrimSpace(currentValue.String()))
	}

	// 解析值
	if len(values) >= 11 {
		// 移除引号
		stripQuotes := func(s string) string {
			s = strings.Trim(s, "'\"")
			return s
		}

		shop.Name = stripQuotes(values[0])
		shop.Email = stripQuotes(values[1])
		shop.Address = stripQuotes(values[2])
		shop.Type = stripQuotes(values[3])
		shop.Contact = stripQuotes(values[4])
		// rating 已经是NULL，gorm会处理
		// latitude 和 longitude 会由gorm自动转换
		// otherInfo 和 imageBase64 会被忽略，因为我们使用other_info和image_base64
		// description 会被设置
		shop.Description = stripQuotes(values[10])
		// phone 设置为NULL
	}

	return shop, nil
}
