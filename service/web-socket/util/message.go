package util

type Message struct {
	Type     int      // 1: 注册消息 2: 新增群 3: 文本消息 4: 图片消息 5: 通知消息 6: 错误消息 7: 用户列表
	Content  string   // 消息内容
	Img      string   // 图片地址
	Name     string   // 名称
	SendId   string   // 发送人ID
	ResultId string   // 接受人ID
	UserList []string // 用户群
}

type ResultMessage struct {
	Type     int                    // 1: 注册消息 2: 文本消息 3: 图片消息 4: 通知消息 5: 错误消息 6: 用户列表
	SendId   string                 // 发送人ID
	ResultId string                 // 接收人ID
	Msg      string                 // 消息
	UserList map[string]UserManager // 用户列表
}

type UserManager struct {
	Id     string
	Avatar string
	Name   string
}
