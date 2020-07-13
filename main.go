package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/swgloomy/gutil"
	"net"
	"os"
	"time"
)

type messageStruct struct {
	Type       int64             `json:"type"`
	Message    string            `json:"message"`
	SendUser   string            `json:"sendUser"`
	ResultUser string            `json:"resultUser"`
	UserName   string            `json:"userName"`
	UserList   map[string]string `json:"userList"`
}

var (
	userName = "xzvasffffffasfd"
	userUUid = ""
	sendUser = ""
	aes      = []byte("anfsis")
)

func main() {
	tcpAddr, err := net.ResolveTCPAddr("tcp4", "192.168.10.91:1200")
	if err != nil {
		fmt.Println("连接失败!")
		return
	}
	conn, err := net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		fmt.Println("连接失败!")
		return
	}

	go func() {
		for true {
			var result = make([]byte, 333333)
			readLen, err := conn.Read(result)
			//result, err := ioutil.ReadAll(conn)
			if err != nil {
				fmt.Println("警告: 数据读取失败!")
				return
			}
			fmt.Println("用户列表获取中!")
			var modal messageStruct
			_ = json.Unmarshal(result[:readLen], &modal)
			if modal.Type == 3 {
				for resultUser, userId := range modal.UserList {
					if resultUser != userName {
						sendUser = userId
					} else {
						userUUid = userId
					}
				}
			}
			if sendUser != "" {
				fmt.Println("用户列表获取完毕!")
				break
			}
			fmt.Println(modal)
			fmt.Println("请等待用户获取!")
		}
	}()

	go func() {
		for true {
			var loginUser = messageStruct{
				Type:       5,
				Message:    userName,
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

	time.Sleep(5 * time.Second)

	loginUser(conn)

	for true {
		if sendUser == "" {
			time.Sleep(3 * time.Second)
			continue
		}
		readMain(conn)
		var result = make([]byte, 333333)
		readLen, err := conn.Read(result)
		if err != nil {
			fmt.Println("警告: 数据读取失败! 对方已断线 err:", err.Error())
			continue
		}
		var modal messageStruct
		_ = json.Unmarshal(result[:readLen], &modal)
		if modal.Type == 2 {
			resultMessage, _ := gutil.AesDecrypt(modal.Message, aes)
			fmt.Println(resultMessage)
		}
	}
}

func loginUser(conn *net.TCPConn) {
	var loginUser = messageStruct{
		Type:       1,
		Message:    "",
		SendUser:   sendUser,
		ResultUser: userUUid,
		UserName:   userName,
		UserList:   make(map[string]string),
	}
	responseByte, _ := json.Marshal(loginUser)
	_, err := conn.Write(responseByte)
	if err != nil {
		fmt.Println("登陆失败!")
		return
	}
}

func readMain(conn *net.TCPConn) {
	f := bufio.NewReader(os.Stdin) //读取输入的内容
	fmt.Print("请输入: ")
	var Input string
	Input, _ = f.ReadString('\n') //定义一行输入的内容分隔符。

	sendMessage, _ := gutil.AesEncrypt(Input, aes)

	var loginUser = messageStruct{
		Type:       2,
		Message:    sendMessage,
		SendUser:   sendUser,
		ResultUser: "",
		UserName:   userName,
		UserList:   make(map[string]string),
	}
	responseByte, _ := json.Marshal(loginUser)
	_, err := conn.Write(responseByte)
	if err != nil {
		fmt.Println("数据发送失败!")
		return
	}
}
