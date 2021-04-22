package util

type Message struct {
	Type     int      `json:"type"`      // 1: 注册消息 2: 新增群 3: 文本消息 4: 图片消息 5: 通知消息 6: 错误消息 7: 用户列表
	Content  string   `json:"content"`   // 消息内容
	Img      string   `json:"img"`       // 图片地址
	Name     string   `json:"name"`      // 名称
	SendId   string   `json:"send_id"`   // 发送人ID
	ResultId string   `json:"result_id"` // 接受人ID
	UserList []string `json:"user_list"` // 用户群
}

type ResultMessage struct {
	Type     int                    `json:"type"`      // 1: 注册消息 2: 文本消息 3: 图片消息 4: 通知消息 5: 错误消息 6: 用户列表
	SendId   string                 `json:"send_id"`   // 发送人ID
	ResultId string                 `json:"result_id"` // 接收人ID
	Msg      string                 `json:"msg"`       // 消息
	UserList map[string]UserManager `json:"user_list"` // 用户列表
}

type UserManager struct {
	Id     string `json:"id"`
	Avatar string `json:"avatar"`
	Name   string `json:"name"`
}
