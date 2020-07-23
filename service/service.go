package main

import (
	"github.com/blackbeans/go-uuid"
	"github.com/gin-gonic/gin"
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"github.com/swgloomy/gutil"
	"golang.org/x/net/websocket"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"sync"
	"syscall"
)

var (
	userList     = map[string]socketList{} // 链接用户
	userListLock sync.RWMutex
	tcpPort      = ":1200"         //监听端口
	pidPath      = "./service.pid" //pid文件
	logDir       = "./logs"
	rt           *gin.Engine
	port         = ":1201"
)

type socketList struct {
	conn     *websocket.Conn //当前用户链接
	userName string          //用户名称
	userIp   string          //用户接入地址
}

func main() {
	if gutil.CheckPid(pidPath) {
		return
	}
	gutil.LogInit(true, logDir)

	serverStart()

	go socketStart()

	rt = gin.Default()
	rt.Use(Cors())
	router(rt)

	go rt.Run(port)

	c := make(chan os.Signal, 1)
	gutil.WritePid(pidPath)
	// 信号处理
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)
	// 等待信号
	<-c
	serverExit()
	gutil.RmPidFile(pidPath)
	os.Exit(0)
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
		c.Header("Access-Control-Allow-Credentials", "true")

		//放行所有OPTIONS方法
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		// 处理请求
		c.Next()
	}
}

func router(r *gin.Engine) {
	g := &r.RouterGroup
	g.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	g.POST("/fileUpload", fileUpload) // 短信发送接口
	g.GET("/file/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.File(name)
	})
}

func fileUpload(c *gin.Context) {
	header, err := c.FormFile("file")
	if err != nil {
		glog.Error("fileUpload formfile err! err: %s \n", err.Error())
		c.Data(http.StatusOK, "application/javascript", []byte(""))
		return
	}
	dst := uuid.New()
	// gin 简单做了封装,拷贝了文件流
	if err := c.SaveUploadedFile(header, dst); err != nil {
		glog.Error("fileUpload SaveUploadedFile err! err: %s \n", err.Error())
		c.Data(http.StatusOK, "application/javascript", []byte(""))
		return
	}
	c.Data(http.StatusOK, "application/javascript", []byte(dst))
}

func serverExit() {
	// 结束所有go routine
	deferinit.StopRoutines()
	glog.Info("stop routine successfully.\n")
	deferinit.FiniAll()
	glog.Info("fini all modules successfully.\n")

	glog.Close()
}

func serverStart() {
	//初始化所有go文件中的init内方法
	deferinit.InitAll()
	glog.Info("init all module successfully \n")

	//设置多CPU运行
	runtime.GOMAXPROCS(runtime.NumCPU())
	glog.Info("set many cpu successfully \n")

	//启动所有go文件中的init方法
	deferinit.RunRoutines()
	glog.Info("init all run successfully \n")
}
