package main

import (
	"encoding/json"
	"github.com/blackbeans/go-uuid"
	"github.com/guotie/deferinit"
	"github.com/smtc/glog"
	"net"
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
	tcpAddr, err := net.ResolveTCPAddr("tcp4", tcpPort)
	if err != nil {
		glog.Error("socketStart ResolveTCPAddr err! tcpPort: %s err: %s \n", tcpPort, err.Error())
		return
	}

	listener, err := net.ListenTCP("tcp", tcpAddr)
	if err != nil {
		glog.Error("socketStart ListenTCP err! tcpPort: %s err: %s \n", tcpPort, err.Error())
		return
	}
	for {
		conn, err := listener.Accept()
		if err != nil {
			glog.Error("socketStart Accept err! tcpPort: %s err: %s \n", tcpPort, err.Error())
			continue
		}
		go connectionStart(conn)
	}
}

type messageStruct struct {
	Type       int64             `json:"type"`
	Message    string            `json:"message"`
	SendUser   string            `json:"sendUser"`
	ResultUser string            `json:"resultUser"`
	UserName   string            `json:"userName"`
	UserList   map[string]string `json:"userList"`
}

func connectionStart(conn net.Conn) {
	err := conn.SetReadDeadline(time.Now().Add(2 * time.Minute))
	if err != nil {
		glog.Error("connectionStart SetReadDeadline err! err: %s \n", err.Error())
		return
	}
	defer func() {
		err = conn.Close()
		if err != nil {
			glog.Error("connectionStart close err! err: %s \n", err.Error())
		}
	}()
	var requestByte = make([]byte, 333333)
	for {
		readLen, err := conn.Read(requestByte)
		if err != nil {
			glog.Error("connectionStart Read err! err: %s \n", err.Error())
			go delUserList(conn.RemoteAddr().String())
			break
		}
		if string(requestByte[:readLen]) == "" {
			continue
		} else {
			var modal messageStruct
			err = json.Unmarshal(requestByte[:readLen], &modal)
			if err != nil {
				glog.Error("connectionStart run err! requestByte: %s err: %s \n", string(requestByte[:readLen]), err.Error())
			} else {
				go messageProcess(conn, &modal)
			}
			glog.Info("connectionStart result message %s \n", string(requestByte[:readLen]))
		}
	}
}

func messageProcess(conn net.Conn, modal *messageStruct) {
	switch modal.Type {
	case 1: //用户登录
		userId := uuid.New()
		userListLock.Lock()
		userList[userId] = socketList{
			conn:     conn,
			userName: modal.UserName,
			userIp:   conn.RemoteAddr().String(),
		}
		userListLock.Unlock()
		go sendUserList()
		break
	case 2: //用户消息
		sendObj, bo := userList[modal.SendUser]
		if bo {
			sendByte, err := json.Marshal(messageStruct{
				Type:       modal.Type,
				Message:    modal.Message,
				SendUser:   modal.ResultUser,
				ResultUser: modal.SendUser,
				UserName:   "",
				UserList:   make(map[string]string),
			})
			if err != nil {
				glog.Error("messageProcess 2 Marshal run err! Message: %s SendUser: %s err: %s \n", modal.Message, modal.ResultUser, err.Error())
				break
			}
			_, err = sendObj.conn.Write(sendByte)
			if err != nil {
				glog.Error("messageProcess 2 Write run err! Message: %s SendUser: %s err: %s \n", modal.Message, modal.ResultUser, err.Error())
				break
			}
		}
		break
	default:
		break
	}
}

func sendUserList() {
	sendUserList := make(map[string]string)
	userListLock.RLock()
	for userId, item := range userList {
		sendUserList[item.userName] = userId
	}
	userListLock.RUnlock()
	sendByte, err := json.Marshal(messageStruct{
		Type:       3,
		Message:    "",
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
	for _, item := range userList {
		_, err = item.conn.Write(sendByte)
		if err != nil {
			glog.Error("sendUserList Write run err! err: %s \n", err.Error())
		}
	}
	userListLock.RUnlock()
}

func delUserList(userIp string) {
	user := ""
	userListLock.RLock()
	for userId, item := range userList {
		if userIp == item.userIp {
			user = userId
			break
		}
	}
	userListLock.RUnlock()
	userListLock.Lock()
	delete(userList, user)
	userListLock.Unlock()

	go sendUserList()
}
