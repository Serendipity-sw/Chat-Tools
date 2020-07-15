import React from 'react';
import '@/css/common/common.pcss';
import './index.pcss';
import style from './index.pcss.json';
import { Button, Input, Modal } from 'antd';

const { TextArea } = Input;

class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userList: [{ 'asjidf': 'asasdfasf' }, { 'sdnucvxz': 'ascnixnzc' }],
      messageList: [],
      selectUser: 'user',
      message: '',
      visible: true,
      loginUser: '',
      loginUserId: ''
    };
    this.socket = null;
  }

  componentDidMount () {
  }

  initSocket = () => {
    try {
      this.socket = new WebSocket('ws://127.0.0:9999/');
      // 用户登录、重连
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify({
          'type': 1,
          'message': '',
          'sendUser': '',
          'resultUser': '',
          'userName': this.state.loginUser,
          'userList': []
        }));
        this.heartbeat();
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
    } catch (e) {
    }
  };
  heartbeat = () => {
    setTimeout(() => {
      this.socket.send(JSON.stringify({
        'type': 5,
        'message': '',
        'sendUser': '',
        'resultUser': '',
        'userName': this.state.loginUser,
        'userList': []
      }));
      this.heartbeat();
    }, 2000);
  };
  switchUser = (selectUser) => {
    this.setState({ selectUser });
  };
  messageChange = (e) => {
    const { value } = e.target;
    this.setState({ message: value });
  };
  loginUserChange = e => {
    const { value } = e.target;
    this.setState({ loginUser: value });
  };
  sendMessage = () => {
    if (this.state.message.length > 0) {
      this.socket.send(JSON.stringify({
        'type': 2,
        'message': this.state.message,
        'sendUser': '',
        'resultUser': '',
        'userName': this.state.loginUser,
        'userList': []
      }));
    }
  };
  handleOk = () => {
    if (this.state.loginUser.trim()) {
      this.setState({
        loginUser: this.state.loginUser.trim(),
        visible: false
      }, () => {
        this.initSocket();
      });
    }
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
                      onChange={ this.messageChange } onPressEnter={ this.sendMessage }/>
            <Button onClick={ this.sendMessage } type="primary">发送</Button>
          </div>
        </div>
        <Modal
          title="请输入登陆用户名"
          visible={ this.state.visible }
          maskClosable={ false }
          onOk={ this.handleOk }
        >
          <Input value={ this.state.loginUser } placeholder="登陆用户名" maxLength={ 8 } onChange={ this.loginUserChange }/>
        </Modal>
      </div>
    );
  }
}

export default Index;
