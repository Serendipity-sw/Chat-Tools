import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import style from './index.pcss'
import Home from "../page/home";
import {connect} from "react-redux";
import {addSocket} from "../reducers/socket";
import Login from "../../components/login";

@connect(
  state => ({socket: state.socket}),
  {addSocket}
)
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginVisible: true
    }
  }

  componentDidMount() {
    this.socketInit()
  }

  socketInit = () => {
    const socket = new WebSocket("ws://localhost:8082/ws")
    this.props.addSocket(socket)
    socket.onopen = () => {
      this.props.socket.send(JSON.stringify({
        type: 1,
        content: '',
        img: '',
        name: 'gloomy',
        send_id: 0,
        result_id: 0,
        user_list: []
      }))
    }
    socket.onmessage = res => {
      console.log(res)
    }
    socket.onerror = res => {
      console.log("失败! ", res)
    }
    socket.onclose = res => {
      console.log("关闭! ", res)
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