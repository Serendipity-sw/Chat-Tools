package main

import (
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"github.com/swgloomy/gutil"
	"net"
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
)

type socketList struct {
	conn     net.Conn //当前用户链接
	userName string   //用户名称
	userIp   string   //用户接入地址
}

func main() {
	if gutil.CheckPid(pidPath) {
		return
	}
	gutil.LogInit(true, logDir)

	serverStart()

	go socketStart()

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
