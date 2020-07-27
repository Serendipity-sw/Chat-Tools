package main

import (
	"encoding/json"
	"fmt"
	"github.com/blackbeans/go-uuid"
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"golang.org/x/net/websocket"
	"net/http"
	"os"
	"sync"
	"time"
)

func init() {
	deferinit.AddRoutine(userListProcess)
}

func userListProcess(ch chan struct{}, wg *sync.WaitGroup) {
	jsTmr := time.NewTimer(15 * time.Second)
	go func() {
		<-ch
		jsTmr.Stop()
		wg.Done()
	}()
	<-jsTmr.C
	for {
		userListLen := 0
		userListLock.RLock()
		userListLen = len(userList)
		userListLock.RUnlock()
		glog.Info("userListProcess userList On-Site Inspection success! userNumber: %d \n", userListLen)
		jsTmr.Reset(15 * time.Second)
		<-jsTmr.C
	}
}

func socketStart() {
	http.Handle("/", websocket.Handler(upper))

	if err := http.ListenAndServe(tcpPort, nil); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func upper(ws *websocket.Conn) {
	defer func() {
		err := ws.Close()
		if err != nil {
			glog.Error("connectionStart close err! err: %s \n", err.Error())
		}
	}()
	var err error
	for {
		var reply []byte

		if err = websocket.Message.Receive(ws, &reply); err != nil {
			fmt.Println("警告: 数据读取失败! 已断线 err:", err.Error())
			break
		}
		if string(reply) == "" {
			continue
		} else {
			var modal messageStruct
			err = json.Unmarshal(reply, &modal)
			if err != nil {
				glog.Error("connectionStart run err! requestByte: %s err: %s \n", string(reply), err.Error())
			} else {
				go messageProcess(ws, &modal)
			}
			glog.Info("connectionStart result message %s \n", string(reply))
		}
	}
}

type messageStruct struct {
	Type       int64               `json:"type"`
	Message    messageContent      `json:"message"`
	SendUser   string              `json:"sendUser"`
	ResultUser string              `json:"resultUser"`
	UserName   string              `json:"userName"`
	UserList   map[string][]string `json:"userList"`
}

type messageContent struct {
	Type int64  `json:"type"`
	Text string `json:"text"`
}

func messageProcess(conn *websocket.Conn, modal *messageStruct) {
	switch modal.Type {
	case 1: //用户登录
		userId := uuid.New()
		userListLock.Lock()
		userList[userId] = append(userList[userId], socketList{
			conn:     conn,
			userName: modal.UserName,
			userIp:   conn.RemoteAddr().String(),
		})
		userListLock.Unlock()
		go sendUserList()
		break
	case 2: //用户消息
		sendArray, bo := userList[modal.SendUser]
		if bo {
			sendByte, err := json.Marshal(messageStruct{
				Type:       modal.Type,
				Message:    modal.Message,
				SendUser:   modal.ResultUser,
				ResultUser: modal.SendUser,
				UserName:   "",
				UserList:   make(map[string][]string),
			})
			if err != nil {
				glog.Error("messageProcess 2 Marshal run err! Message: %s SendUser: %s err: %s \n", modal.Message, modal.ResultUser, err.Error())
				break
			}
			for _, item := range sendArray {
				err = websocket.Message.Send(item.conn, string(sendByte))
				if err != nil {
					glog.Error("messageProcess 2 Write run err! Message: %s SendUser: %s err: %s \n", modal.Message, modal.ResultUser, err.Error())
					continue
				}
			}
		}
		break
	default:
		break
	}
}

func sendUserList() {
	sendUserList := make(map[string][]string)
	userListLock.RLock()
	for userId, itemArray := range userList {
		for _, item := range itemArray {
			sendUserList[userId] = append(sendUserList[userId], item.userName)
		}
	}
	userListLock.RUnlock()
	sendByte, err := json.Marshal(messageStruct{
		Type: 3,
		Message: messageContent{
			Type: 0,
			Text: "",
		},
		SendUser:   "",
		ResultUser: "",
		UserName:   "",
		UserList:   sendUserList,
	})
	if err != nil {
		glog.Error("sendUserList Marshal err: %s \n", err.Error())
		return
	}
	userListLock.RLock()
	for _, itemArray := range userList {
		for _, item := range itemArray {
			err = websocket.Message.Send(item.conn, string(sendByte))
			if err != nil {
				glog.Error("sendUserList Write run err! err: %s \n", err.Error())
			}
		}
	}
	userListLock.RUnlock()
}
