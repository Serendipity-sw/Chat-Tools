import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import style from './index.pcss'
import Home from "../page/home";
import {connect} from "react-redux";
import {addSocket} from "../reducers/socket";
import Login from "../../components/login";
import {addMessage, addUserList} from "../reducers/socketMessage";
import {addUser} from "../reducers/user";
import {aesKey, webSocketConfig} from "../../util/httpConfig";
import CryptoJS from "crypto-js";

@connect(
  state => ({socket: state.socket, user: state.user}),
  {addSocket, addUserList, addMessage, addUser}
)
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginVisible: true
    }
    this.heartInterval = 0;
  }

  componentDidMount() {
    this.props.addSocket({socketInit: this.socketInit})
  }

  socketInit = () => {
    const socket = new WebSocket(webSocketConfig)
    this.props.addSocket({socket})
    socket.onopen = () => {
      this.props.socket.socket.send(JSON.stringify({
        type: 1,
        msg: '',
        img: this.props.user.imageUrl,
        name: CryptoJS.AES.encrypt(this.props.user.userName, aesKey).toString(),
        send_id: '',
        result_id: '',
        user_list: []
      }))
      this.heartBeatNotice()
    }
    socket.onmessage = res => {
      let {data} = res
      this.socketMessageProcess(JSON.parse(data))
    }
    socket.onerror = res => {
      console.log("失败! ", res)
      this.closeHearInterval()
    }
    socket.onclose = res => {
      console.log("关闭! ", res)
      this.closeHearInterval()
    }
  }

  closeHearInterval = () => {
    this.heartInterval && clearInterval(this.heartInterval)
  }

  heartBeatNotice = () => {
    this.closeHearInterval()
    this.heartInterval = setInterval(socket => {
      socket.send(JSON.stringify({
        type: 8,
        msg: '心跳',
        img: '',
        name: '',
        send_id: '',
        result_id: '',
        user_list: []
      }))
    }, 3000, this.props.socket.socket)
  }

  socketMessageProcess = data => {
    const {addUserList, addMessage} = this.props
    switch (data.type) {
      case 1: // 注册成功
        this.props.addUser({id: data.msg})
        break
      case 6: // 用户列表
        addUserList(data.user_list)
        break
      case 2: // 文本消息
        globalThis.api.send('notification')
        addMessage(data)
        break
      case 3: // 图片消息
        globalThis.api.send('notification')
        addMessage(data)
        break
      case 9: // 文件消息
        globalThis.api.send('notification')
        addMessage(data)
        break
    }
  }

  closeLogin = () => this.setState({isLoginVisible: false})

  render() {
    return (
      <HashRouter>
        <div className={style.init}>
          <Route exact path="/" component={Home}/>
          <Login isLoginVisible={this.state.isLoginVisible} closeLogin={this.closeLogin}/>
        </div>
      </HashRouter>
    );
  }
}

export default Router;