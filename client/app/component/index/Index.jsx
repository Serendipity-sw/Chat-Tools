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
      this.socket = new WebSocket('ws://127.0.0.1:9999/');
      // 用户登录、重连
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
        this.socket.send(bytes);
      };
      // 接收消息
      this.socket.onmessage = res => {
        console.log(res);
      };
      // 连接错误: 重连
      this.socket.onerror = () => {
        //this.initSocket();
      };
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
  switchUser = (selectUser) => {
    this.setState({ selectUser });
  };
  messageChange = (e) => {
    const { value } = e.target;
    this.setState({ message: value });
  };
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
                onClick={ () => {item !== this.state.selectUser && this.switchUser(item);} }>
                <span
                  key={ index }
                  className={ style.userName }>{ item }</span>
              </div>)
          }
        </div>
        <div className={ style.contentArea }>
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
