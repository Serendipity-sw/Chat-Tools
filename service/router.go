package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	websocket "wallpaper-collector/service/web-socket"
)

func setGinRouter(r *gin.Engine) {
	g := &r.RouterGroup
	{
		g.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "ok") }) //确认接口服务程序是否健在
		g.GET("/ws", func(c *gin.Context) {
			websocket.WsHandler(c.Writer, c.Request)
		})
	}
}
