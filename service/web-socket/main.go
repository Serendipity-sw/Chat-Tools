package web_socket

import (
	"encoding/json"
	"github.com/google/uuid"
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
	}
	socketArray     map[string]util.Manager
	socketArrayLock sync.RWMutex
)

func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := wsUpgrade.Upgrade(w, r, nil)
	if err != nil {
		glog.Error("WsHandler Failed to set websocket upgrade: %+v \n", err)
		return
	}
	go readMessage(conn)
}

func readMessage(conn *websocket.Conn) {
	for {
		t, msg, err := conn.ReadMessage()
		if err != nil || t == websocket.CloseMessage {
			glog.Error("WsHandler read message err! err: %+v \n", err)
			break
		}
		go messageProcess(msg, conn, t)
	}
}

func messageProcess(strBuffer []byte, conn *websocket.Conn, messageType int) {
	var messageObj util.Message
	err := json.Unmarshal(strBuffer, &messageObj)
	if err != nil {
		glog.Error("messageProcess unMarshal err! err: %+v \n", err)
		go sendMessage(conn, messageType, util.ResultMessage{Type: 5, Msg: "传递JSON数据解析失败!"})
		return
	}
	switch messageObj.Type {
	case 1: // 用户注册消息
		go registeredUserMessage(conn, messageType, &messageObj)
		break
	case 2: // 注册群组

		break
	}
}

func registeredGroupMessage() {

}

func registeredUserMessage(conn *websocket.Conn, messageType int, messageObj *util.Message) {
	uuidObj, err := uuid.NewUUID()
	if err != nil {
		glog.Error("messageProcess NewUUID run err! err: %+v \n", err)
		go sendMessage(conn, messageType, util.ResultMessage{Type: 5, Msg: "服务端生成UUID失败!"})
		return
	}
	var modal util.Manager
	modal.Id = uuidObj.String()
	modal.Name = messageObj.Content
	modal.Avatar = messageObj.Img
	modal.Conn = conn
	socketArrayLock.Lock()
	socketArray[modal.Id] = modal
	socketArrayLock.Unlock()
	go sendMessage(conn, messageType, util.ResultMessage{Type: 4, Msg: "注册成功"})
	go sendUserList(conn, messageType)
}

func sendUserList(conn *websocket.Conn, messageType int) {
	socketArrayLock.RLock()
	defer socketArrayLock.RUnlock()
	var result = util.ResultMessage{
		Type: 6,
	}
	for _, manager := range socketArray {
		result.UserList[manager.Id] = util.UserManager{Id: manager.Id, Avatar: manager.Avatar, Name: manager.Name}
	}
	go sendMessage(conn, messageType, result)
}

func sendMessage(conn *websocket.Conn, messageType int, msg util.ResultMessage) {
	resultByte, err := json.Marshal(msg)
	if err != nil {
		glog.Error("sendMessage Marshal run err! err: %+v \n", err)
		return
	}
	err = conn.WriteMessage(messageType, resultByte)
	if err != nil {
		glog.Error("wsHandler sendMessage err! err: %+v \n", err)
	}
}
