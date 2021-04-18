package util

import (
	"github.com/gorilla/websocket"
)

type Manager struct {
	Id         string
	Avatar     string
	Name       string
	Group      []*Manager
	GroupCount uint
	Conn       *websocket.Conn
}
