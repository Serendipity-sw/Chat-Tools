import React from 'react';
import '@/css/common/common.pcss';
import './index.pcss';
import style from './index.pcss.json';
import { Button, Input } from 'antd';

const { TextArea } = Input;

class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userList: ['user', 'test', 'ming'],
      messageList: [],
      selectUser: 'user',
      message: ''
    };
    this.socket = null;
  }

  componentDidMount () {
    this.initSocket();
  }

  initSocket = () => {
    try {
      this.socket = new WebSocket('ws://127.0.0:9999/');
      // 用户登录、重连   一旦服务器响应了websocket连接请求，open事件触发并建立一个连接
      this.socket.onopen = () => {
        let bytes = JSON.stringify({
          'type': 1,
          'message': '',
          'sendUser': '',
          'resultUser': '',
          'userName': 'gloomy',
          'userList': []
        });
        console.log(123);
        console.log(bytes);
        this.socket.send(bytes); // 发送消息
      };
      // 接收消息
      this.socket.onmessage = res => {
        console.log(res);
      };
      // 连接错误: 重连
      this.socket.onerror = () => {
        //this.initSocket();
      };
      // onclose 连接关闭时触发
      this.socket.onclose = () => {
        this.socket = null;
      };
      let bytes = JSON.stringify({
        'type': 1,
        'message': '',
        'sendUser': '',
        'resultUser': '',
        'userName': 'gloomy',
        'userList': []
      });
      console.log(123);
      console.log(bytes);
      this.socket.send(bytes);
    } catch (e) {
    }
  };
  /*
  * 用户列表切换用户
  * */
  switchUser = (selectUser) => {
    this.setState({ selectUser });
  };
  /*
  * 输入框的change事件，
  * */
  messageChange = (e) => {
    const { value } = e.target; // e.target => input框 value => input框的内容
    this.setState({ message: value });
  };
  /*
  * 发送按钮的点击事件
  * */
  sendMessage = () => {
  };

  render () {
    return (
      <div className={ style.init }>
        <div className={ style.userList }>
          {
            this.state.userList.map((item, index) =>
              <div
                key={ index }
                className={ [style.rows, item === this.state.selectUser && style.select].join(' ') }
                /*
                * 左侧用户列表，点击事件=> 用户不等于当前正在聊天的用户，才可点击切换
                *  */
                onClick={ () => {item !== this.state.selectUser && this.switchUser(item);} }>
                <span
                  key={ index }
                  className={ style.userName }>{ item }</span>
              </div>)
          }
        </div>
        <div className={ style.contentArea }>
          {/* 消息列表 */ }
          <div className={ style.content }>
            <div className={ style.rows }>
              <span
                className={ style.userMessage }>你号阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水阿苏发哈水电费</span>
            </div>
            <div className={ style.rows }>
              <span className={ style.userMessage }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ style.rows }>
              <span className={ style.userMessage }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ style.rows }>
              <span className={ style.userMessage }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ style.rows }>
              <span className={ style.userMessage }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ style.rows }>
              <span className={ style.userMessage }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
            <div className={ [style.rows, style.customerUser].join(' ') }>
              <span className={ style.customerService }>你号阿苏发哈水电费</span>
            </div>
          </div>
          {/* 底部输入框 */ }
          <div className={ style.optionArea }>
            <TextArea placeholder="请输入" value={ this.state.message } className={ style.messageInput } rows={ 8 }
                      onChange={ this.messageChange }/>
            <Button onClick={ this.sendMessage } type="primary">发送</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
