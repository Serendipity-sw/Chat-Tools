package web_socket

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/swgloomy/gutil/glog"
	"net/http"
	"sync"
	"wallpaper-collector/service/web-socket/util"
)

var (
	wsUpgrade = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	socketArray     = make(map[string]util.Manager)
	socketArrayLock sync.RWMutex
)

func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := wsUpgrade.Upgrade(w, r, nil)
	if err != nil {
		glog.Error("WsHandler Failed to set websocket upgrade! err: %+v \n", err)
		return
	}
	go readMessage(conn)
}

func readMessage(conn *websocket.Conn) {
	for {
		t, msg, err := conn.ReadMessage()
		if err != nil || t == websocket.CloseMessage {
			go delSocket(fmt.Sprintf("%p", conn))
			glog.Error("WsHandler read message err! err: %+v \n", err)
			break
		}
		go messageProcess(msg, conn)
	}
}

func delSocket(pointer string) {
	socketArrayLock.Lock()
	for _, manager := range socketArray {
		if manager.GroupCount != 1 {
			for index, item := range manager.Group {
				if item.Id == pointer {
					manager.Group = append(manager.Group[:index], manager.Group[:index+1]...)
					break
				}
			}
		}
	}
	delete(socketArray, pointer)
	socketArrayLock.Unlock()
	go sendUserList(nil)
}

func messageProcess(strBuffer []byte, conn *websocket.Conn) {
	var messageObj util.Message
	err := json.Unmarshal(strBuffer, &messageObj)
	if err != nil {
		glog.Error("messageProcess unMarshal err! err: %+v \n", err)
		go sendMessage(conn, util.ResultMessage{Type: 5, Msg: "传递JSON数据解析失败!"})
		return
	}
	switch messageObj.Type {
	case 1: // 用户注册消息
		go registeredUserMessage(conn, &messageObj)
		break
	case 2: // 注册群组
		go registeredGroupMessage(conn, &messageObj)
		break
	case 3: // 文本消息
		socketArrayLock.RLock()
		defer socketArrayLock.RUnlock()
		sendMessage(conn, util.ResultMessage{Type: 2, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		sendMessage(socketArray[messageObj.ResultId].Conn, util.ResultMessage{Type: 2, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		break
	case 4: // 图片消息
		socketArrayLock.RLock()
		defer socketArrayLock.RUnlock()
		sendMessage(conn, util.ResultMessage{Type: 3, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		sendMessage(socketArray[messageObj.ResultId].Conn, util.ResultMessage{Type: 3, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		break
	case 8: // 心跳消息
		sendMessage(conn, util.ResultMessage{Type: 8, Msg: messageObj.Msg})
		break
	case 9: // 文件消息
		socketArrayLock.RLock()
		defer socketArrayLock.RUnlock()
		sendMessage(conn, util.ResultMessage{Type: 9, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		sendMessage(socketArray[messageObj.ResultId].Conn, util.ResultMessage{Type: 9, Msg: messageObj.Msg, SendId: messageObj.SendId, ResultId: messageObj.ResultId})
		break
	}
}

func registeredGroupMessage(conn *websocket.Conn, messageObj *util.Message) {
	var modal util.Manager
	modal.Id = fmt.Sprintf("%p", conn)
	modal.Name = messageObj.Name
	modal.Avatar = messageObj.Img
	modal.GroupCount = len(messageObj.UserList)
	socketArrayLock.Lock()
	defer socketArrayLock.Unlock()
	for _, item := range messageObj.UserList {
		itemManager := socketArray[item]
		modal.Group = append(modal.Group, &itemManager)
	}
	sendMessage(modal.Conn, util.ResultMessage{Type: 7, Msg: modal.Id})
	go sendUserList(&messageObj.UserList)
}

func registeredUserMessage(conn *websocket.Conn, messageObj *util.Message) {
	var modal util.Manager
	modal.Id = fmt.Sprintf("%p", conn)
	modal.Name = messageObj.Name
	modal.Avatar = messageObj.Img
	modal.GroupCount = 1
	modal.Conn = conn
	socketArrayLock.Lock()
	defer socketArrayLock.Unlock()
	socketArray[modal.Id] = modal
	sendMessage(modal.Conn, util.ResultMessage{Type: 1, Msg: modal.Id})
	go sendUserList(nil)
}

func sendUserList(userList *[]string) {
	socketArrayLock.RLock()
	defer socketArrayLock.RUnlock()
	var bo bool
	for _, item := range socketArray {
		if userList != nil {
			for _, modal := range *userList {
				bo = modal == item.Id
				if bo {
					break
				}
			}
			if !bo {
				continue
			}
		}
		var result = util.ResultMessage{
			Type:     6,
			UserList: make(map[string]util.UserManager),
		}
		for _, manager := range socketArray {
			if item.Id == manager.Id && manager.GroupCount == 1 {
				continue
			}
			if manager.GroupCount != 1 {
				for _, modal := range manager.Group {
					bo = modal.Id == item.Id
					if bo {
						break
					}
				}
				if !bo {
					continue
				}
			}
			result.UserList[manager.Id] = util.UserManager{Id: manager.Id, Avatar: manager.Avatar, Name: manager.Name}
		}
		sendMessage(item.Conn, result)
	}
}

func sendMessage(conn *websocket.Conn, msg util.ResultMessage) {
	resultByte, err := json.Marshal(msg)
	if err != nil {
		glog.Error("sendMessage Marshal run err! err: %+v \n", err)
		return
	}
	if conn != nil {
		err = conn.WriteMessage(websocket.TextMessage, resultByte)
		if err != nil {
			glog.Error("wsHandler sendMessage err! err: %+v \n", err)
		}
	}
}
