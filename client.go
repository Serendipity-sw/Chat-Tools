package main

import (
	"fmt"
	"golang.org/x/net/websocket"
	"net/http"
	"os"
)

func upper(ws *websocket.Conn) {
	var err error
	for {
		var reply string

		if err = websocket.Message.Receive(ws, &reply); err != nil {
			fmt.Println(err)
			continue
		}

		if err = websocket.Message.Send(ws, reply); err != nil {
			fmt.Println(err)
			continue
		}
	}
}

func main() {
	http.Handle("/", websocket.Handler(upper))

	if err := http.ListenAndServe(":9999", nil); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
