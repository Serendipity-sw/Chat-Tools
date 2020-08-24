package main

import (
	"encoding/json"
	"fmt"
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"github.com/swgloomy/gutil"
	"golang.org/x/net/websocket"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"
)

var (
	tcpPort    = ":9999" //监听端口
	tcpService = "ws://45.76.205.126:1200/"
	tcpOrigin  = "http://45.76.205.126:1200/"
	logDir     = "./logs"
	aes        = []byte("1231wdeasdanfsis")
	conn       *websocket.Conn
)

func main() {
	gutil.LogInit(true, logDir)

	serverStart()

	go socket()

	c := make(chan os.Signal, 1)
	// 信号处理
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)
	// 等待信号
	<-c
	serverExit()
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
	Type       int64          `json:"type"`
	Message    messageContent `json:"message"`
	SendUser   string         `json:"sendUser"`
	ResultUser string         `json:"resultUser"`
	UserName   string         `json:"userName"`
	UserList   interface{}    `json:"userList"`
}

type messageContent struct {
	Type int64  `json:"type"`
	Text string `json:"text"`
}

func upper(ws *websocket.Conn) {
	tcpSocket()

	go func() {
		var err error
		for {
			var reply []byte

			if err = websocket.Message.Receive(ws, &reply); err != nil {
				fmt.Println("警告: 数据读取失败! 已断线 err:", err.Error())
				break
			}
			go messageProcess(reply)
		}
	}()

	for true {
		var reply []byte
		if err := websocket.Message.Receive(conn, &reply); err != nil {
			fmt.Println("警告: 数据读取失败! 已断线 err:", err.Error())
			break
		}
		go sendContent(ws, reply)
	}
}

func sendContent(ws *websocket.Conn, result []byte) {
	var modal messageStruct
	_ = json.Unmarshal(result, &modal)
	if modal.Message.Text != "" && modal.Message.Type == 1 {
		contentDe, _ := gutil.AesDecrypt(modal.Message.Text, aes)
		modal.Message.Text = contentDe
	}
	replyByte, _ := json.Marshal(modal)

	var err error
	if err = websocket.Message.Send(ws, string(replyByte)); err != nil {
		fmt.Println(err)
		return
	}
}

func messageProcess(result []byte) {
	var modal messageStruct
	err := json.Unmarshal(result, &modal)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if modal.Message.Text != "" && modal.Message.Type == 1 {
		message, _ := gutil.AesEncrypt(modal.Message.Text, aes)
		modal.Message.Text = message
	}
	responseByte, _ := json.Marshal(modal)
	err = websocket.Message.Send(conn, string(responseByte))
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
	websocketConn, err := websocket.Dial(tcpService, "", tcpOrigin)
	if err != nil {
		fmt.Println("连接失败!")
		return
	}
	conn = websocketConn
	go func() {
		for true {
			var loginUser = messageStruct{
				Type: 5,
				Message: messageContent{
					Type: 0,
					Text: "",
				},
				SendUser:   "",
				ResultUser: "",
				UserName:   "",
				UserList:   make(map[string]string),
			}
			responseByte, _ := json.Marshal(loginUser)
			err := websocket.Message.Send(conn, string(responseByte))
			if err != nil {
				fmt.Println("心跳包发送失败!")
				return
			}
			time.Sleep(7 * time.Second)
		}
	}()
}
