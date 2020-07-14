package main

import (
	"encoding/json"
	"fmt"
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"github.com/swgloomy/gutil"
	"golang.org/x/net/websocket"
	"net"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"
)

var (
	tcpPort    = ":9999" //监听端口
	tcpService = "192.168.10.91:1200"
	pidPath    = "./client.pid" //pid文件
	logDir     = "./logs"
	aes        = []byte("1231wdeasdanfsis")
	conn       net.Conn
)

func main() {
	if gutil.CheckPid(pidPath) {
		return
	}
	gutil.LogInit(true, logDir)

	serverStart()

	go socket()

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

type messageStruct struct {
	Type       int64             `json:"type"`
	Message    string            `json:"message"`
	SendUser   string            `json:"sendUser"`
	ResultUser string            `json:"resultUser"`
	UserName   string            `json:"userName"`
	UserList   map[string]string `json:"userList"`
}

func upper(ws *websocket.Conn) {
	tcpSocket()

	go func() {
		var err error
		for {
			var reply []byte

			if err = websocket.Message.Receive(ws, &reply); err != nil {
				fmt.Println(err)
				continue
			}
			go messageProcess(reply)
		}
	}()

	for true {
		if sendUser == "" {
			time.Sleep(3 * time.Second)
			continue
		}
		var result = make([]byte, 333333)
		readLen, err := conn.Read(result)
		if err != nil {
			fmt.Println("警告: 数据读取失败! 对方已断线 err:", err.Error())
			continue
		}
		var modal messageStruct
		_ = json.Unmarshal(result[:readLen], &modal)
		if modal.Message != "" {
			contentDe, _ := gutil.AesDecrypt(modal.Message, aes)
			modal.Message = contentDe
		}
		replyByte, _ := json.Marshal(modal)
		go sendContent(ws, string(replyByte))
	}
}

func sendContent(ws *websocket.Conn, reply string) {
	var err error
	if err = websocket.Message.Send(ws, reply); err != nil {
		fmt.Println(err)
		return
	}
}

func messageProcess(result []byte) {
	var modal messageStruct
	_ = json.Unmarshal(result, &modal)
	if modal.Message != "" {
		message, _ := gutil.AesEncrypt(modal.Message, aes)
		modal.Message = message
	}
	responseByte, _ := json.Marshal(modal)
	_, err := conn.Write(responseByte)
	if err != nil {
		fmt.Println("发送失败!")
	}
}

func socket() {
	http.Handle("/", websocket.Handler(upper))

	if err := http.ListenAndServe(":9999", nil); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func tcpSocket() {
	tcpAddr, err := net.ResolveTCPAddr("tcp4", tcpService)
	if err != nil {
		fmt.Println("连接失败!")
		return
	}
	conn, err = net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		fmt.Println("连接失败!")
		return
	}
	go func() {
		for true {
			var loginUser = messageStruct{
				Type:       5,
				Message:    "",
				SendUser:   "",
				ResultUser: "",
				UserName:   "",
				UserList:   make(map[string]string),
			}
			responseByte, _ := json.Marshal(loginUser)
			_, err := conn.Write(responseByte)
			if err != nil {
				fmt.Println("心跳包发送失败!")
				return
			}
			time.Sleep(7 * time.Second)
		}
	}()
}
