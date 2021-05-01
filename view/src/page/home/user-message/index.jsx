import React from 'react'
import style from './index.pcss'
import {connect} from "react-redux";
import {addMessage} from "../../../reducers/socketMessage";
import CryptoJS from 'crypto-js'
import {aesKey, httpConfig} from "../../../../util/httpConfig";
import {message, Popover, Upload} from "antd";
import Expression from "./expression";

@connect(
  state => ({socket: state.socket.socket, user: state.user, selectUser: state.chat.selectUser}),
  {addMessage}
)
class UserMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  }

  messageChange = event => {
    this.setState({message: event.target.value})
  }

  enterPress = event => {
    if (event.keyCode === 13) {
      this.props.socket.send(JSON.stringify({
        type: 3,
        msg: CryptoJS.AES.encrypt(this.state.message, aesKey).toString(),
        img: '',
        name: '',
        send_id: this.props.user.id,
        result_id: this.props.selectUser,
        user_list: []
      }))
      this.setState({message: ''})
    }
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只支持图片格式!');
    }
    return isJpgOrPng
  }

  handleChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        this.props.socket.send(JSON.stringify({
          type: 4,
          msg: `${httpConfig}/file/${info.file.response.msg}`,
          img: '',
          name: '',
          send_id: this.props.user.id,
          result_id: this.props.selectUser,
          user_list: []
        }))
      } else {
        message.error(info.file.response.msg)
      }
    }
  }

  fileUploadSuccess = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        this.props.socket.send(JSON.stringify({
          type: 9,
          msg: CryptoJS.AES.encrypt(`${httpConfig}/file/${info.file.response.msg}`, aesKey).toString(),
          img: '',
          name: '',
          send_id: this.props.user.id,
          result_id: this.props.selectUser,
          user_list: []
        }))
      } else {
        message.error(info.file.response.msg)
      }
    }
  }

  render() {
    return (
      <div className={style.init}>
        <div className={style.toolBox}>
          <Popover placement="topLeft" content={<Expression/>} trigger="click">
            <i className={style.expression}>&#xe602;</i>
          </Popover>
          <Upload
            className={style.marginLeft}
            showUploadList={false}
            action={`${httpConfig}/uploadFile`}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <i className={style.expression}>&#xe676;</i>
          </Upload>
          <Upload
            className={style.marginLeft}
            showUploadList={false}
            action={`${httpConfig}/uploadFile`}
            onChange={this.fileUploadSuccess}
          >
            <i className={style.expression}>&#xe611;</i>
          </Upload>
        </div>
        <textarea value={this.state.message} onChange={this.messageChange} onKeyDown={this.enterPress}
                  className={style.inputArea}/>
      </div>
    )
  }
}

export default UserMessage