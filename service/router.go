package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/swgloomy/gutil/glog"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	websocket "wallpaper-collector/service/web-socket"
)

func setGinRouter(r *gin.Engine) {
	g := &r.RouterGroup
	{
		g.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "ok") }) //确认接口服务程序是否健在
		g.POST("/uploadImg", uploadImg)                                    //图片上传
		g.GET("/img/:file", getImg)                                        //图片获取
		g.GET("/ws", func(c *gin.Context) {
			websocket.WsHandler(c.Writer, c.Request)
		})
	}
}

func uploadImg(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		errStr := fmt.Sprintf("uploadImg formFile nothing! err: %s ", err.Error())
		glog.Error("%s \n", errStr)
		c.String(http.StatusOK, errStr)
		return
	}
	fileName, err := uuid.NewUUID()
	if err != nil {
		errStr := fmt.Sprintf("uploadImg NewUUID run err! err: %+v ", err)
		glog.Error("%s \n", errStr)
		c.String(http.StatusOK, errStr)
		return
	}
	err = saveUploadFile(file, fmt.Sprintf("%s/%s.png", pictureDir, fileName))
	if err != nil {
		errStr := fmt.Sprintf("uploadImg saveUploadFile run err! fileName: %s fileSize: %d err: %s ", fileName, file.Size, err.Error())
		glog.Error("%s \n", errStr)
		c.String(http.StatusOK, errStr)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  fmt.Sprintf("%s.png", fileName),
	})
}

func getImg(c *gin.Context) {
	fileName := c.Param("file")
	c.File(fmt.Sprintf("./%s/%s", pictureDir, fileName))
}

func saveUploadFile(file *multipart.FileHeader, dst string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer func() {
		err = src.Close()
		if err != nil {
			glog.Error("saveUploadFile close run err! err: %s \n", err.Error())
		}
	}()

	out, err := os.OpenFile(dst, os.O_RDWR|os.O_CREATE|os.O_TRUNC, os.ModePerm)
	if err != nil {
		return err
	}
	defer func() {
		err = out.Close()
		if err != nil {
			glog.Error("saveUploadFile out close run err! err: %s \n", err.Error())
		}
	}()

	_, err = io.Copy(out, src)
	return err
}
