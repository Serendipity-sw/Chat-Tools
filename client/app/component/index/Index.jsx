import React from 'react';
import '@/css/common/common.pcss';
import './index.pcss';
import style from './index.pcss.json';
import { Button, Input, Modal,Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userList: { 'qewrqwr': 'qwerqwerq', 'cxzczv': 'cxvz' },
      messageList: [],
      selectUser: {
        name: '',
        userId: ''
      },
      message: '',
      visible: true,
      loginUser: '',
      loginUserId: '',
      loading: false // 图片loading
    };
    this.socket = null;
    this.contentObj = null;
  }

  componentDidMount () {
    if (Notification && Notification.permission !== 'denied') {
      Notification.requestPermission(function (status) {
        new Notification('新消息', { body: '您有一条新短消息!' });
      });
    }
  }

  initSocket = () => {
    try {
      this.socket = new WebSocket('ws://127.0.0.1:9999/');
      // 用户登录、重连   一旦服务器响应了websocket连接请求，open事件触发并建立一个连接
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify({
          'type': 1,
          'message': '',
          'sendUser': '',
          'resultUser': '',
          'userName': this.state.loginUser,
          'userList': []
        })); // 发送消息
        this.heartbeat();
      };
      // 接收消息
      this.socket.onmessage = res => {
        this.messageProcess(JSON.parse(res.data));
      };
      // 连接错误: 重连
      this.socket.onerror = () => {
        //this.initSocket();
      };
      // onclose 连接关闭时触发
      this.socket.onclose = () => {
        this.socket = null;
      };
    } catch (e) {
    }
  };
  messageProcess = data => {
    switch (data.type) {
      case 2: // 发消息
        if (Notification && Notification.permission !== 'denied') {
          Notification.requestPermission(function (status) {
            new Notification('新消息提醒', { body: '您有一条新短消息!' });
          });
        }
        this.setState({
          messageList: [
            ...this.state.messageList,
            {
              ...data,
              resultUser: data.sendUser,
              sendUser: data.resultUser
            }
          ]
        }, () => {
          this.contentObj.scrollTo(0, this.contentObj.scrollHeight);
        });
        break;
      case 3:
        let loginUserId = '';
        for (const userListKey in data.userList) {
          if (this.state.loginUser === data.userList[userListKey]) {
            loginUserId = userListKey;
          }
        }
        this.setState({
          loginUserId,
          userList: data.userList
        });
        break;
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
  /*
  * 用户列表切换用户
  * */
  switchUser = userId => {
    this.setState({
      selectUser: {
        name: this.state.userList[userId],
        userId: userId
      }
    });
  };
  /*
  * 输入框的change事件
  * */
  messageChange = (e) => {
    console.log('e.target:', e.target);
    const { value } = e.target;
    this.setState({ message: value });
  };
  /*
  * 用户名输入框
  * */
  loginUserChange = e => {
    const { value } = e.target;
    this.setState({ loginUser: value });
  };
  /*
  * 发送按钮的点击事件
  * */
  sendMessage = () => {
    if (this.state.message.length > 0) {
      let sendData = {
        'type': 2,
        'message': this.state.message,
        'sendUser': this.state.selectUser.userId,
        'resultUser': this.state.loginUserId,
        'userName': this.state.loginUser,
        'userList': []
      };
      this.socket.send(JSON.stringify(sendData));
      this.setState({
        message: '',
        messageList: [
          ...this.state.messageList,
          sendData
        ]
      }, () => {
        this.contentObj.scrollTo(0, this.contentObj.scrollHeight);
      });
    }
  };
  /*
  * 弹窗OK
  * */
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
  userListDomProcess = userList => {
    let domArray = [];
    for (const userListKey in userList) {
      domArray.push(
        <div
          key={ userListKey }
          className={ [style.rows, userListKey === this.state.selectUser.userId && style.select].join(' ') }
          /*
           * 左侧用户列表，点击事件=> 用户不等于当前正在聊天的用户，才可点击切换
           *  */
          onClick={ () => {userListKey !== this.state.selectUser.userId && this.switchUser(userListKey);} }>
          <span
            key={ userListKey }
            className={ style.userName }>{ userList[userListKey] }</span>
        </div>
      );
    }
    return domArray;
  };


   getBase64 = (img, callback) => {
    const reader = new FileReader(); // 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img); // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。
  };

  /*
  * 图片格式大小限制
  * */
   beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG！');
    }
    return isJpgOrPng;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render () {
    const uploadButton = (
      <Button>
        <UploadOutlined /> Click to Upload
      </Button>
    );
    const { imageUrl } = this.state;
    return (
      <div className={ style.init }>
        <div className={ style.userList }>
          {
            this.userListDomProcess(this.state.userList)
          }
        </div>
        <div className={ style.contentArea }>
          {/* 消息列表 */ }
          <div className={ style.content } ref={ el => this.contentObj = el }>
            {
              this.state.messageList.filter(item => item.resultUser === this.state.selectUser.userId || item.sendUser === this.state.selectUser.userId).map((item, index) => {
                if (item.resultUser === this.state.selectUser.userId) {
                  return <div key={ index } className={ style.rows }>
              <span
                className={ style.userMessage }>{ item.message }</span>
                  </div>;
                } else {
                  return <div key={ index } className={ [style.rows, style.customerUser].join(' ') }>
                    <span className={ style.customerService }>{ item.message }</span>
                  </div>;
                }
              })
            }
          </div>
          {/* 底部输入框 */ }
          <div className={ style.optionArea }>
            <TextArea placeholder="请输入" value={ this.state.message } className={ style.messageInput } rows={ 8 }
                      onChange={ this.messageChange } onPressEnter={ this.sendMessage }/>
            {/*<Input type="file" value={ this.state.message } onChange={ this.messageChange }/>*/}
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
{/*{<Button>
                <UploadOutlined /> Click to Upload
              </Button>}*/}
            </Upload>

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
