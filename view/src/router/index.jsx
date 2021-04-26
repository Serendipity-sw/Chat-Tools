import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import style from './index.pcss'
import Home from "../page/home";
import {connect} from "react-redux";
import {addSocket} from "../reducers/socket";
import Login from "../../components/login";
import {addMessage, addUserList} from "../reducers/socketMessage";
import {addUser} from "../reducers/user";
import {webSocketConfig} from "../../util/httpConfig";

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
        content: '',
        img: this.props.user.imageUrl,
        name: this.props.user.userName,
        send_id: '',
        result_id: '',
        user_list: []
      }))
    }
    socket.onmessage = res => {
      let {data} = res
      this.socketMessageProcess(JSON.parse(data))
    }
    socket.onerror = res => {
      console.log("失败! ", res)
    }
    socket.onclose = res => {
      console.log("关闭! ", res)
    }
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
        addMessage(data)
        break
      case 3: // 图片消息
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