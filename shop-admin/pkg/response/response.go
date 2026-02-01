package response

import (
	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// Success 成功响应
func Success(c *gin.Context, message string, data interface{}) {
	c.JSON(200, Response{
		Code:    200,
		Message: message,
		Data:    data,
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string, err error) {
	data := interface{}(nil)
	if err != nil {
		data = err.Error()
	}

	c.JSON(code, Response{
		Code:    code,
		Message: message,
		Data:    data,
	})
}
