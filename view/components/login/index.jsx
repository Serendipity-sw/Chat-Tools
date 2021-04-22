import React from 'react'
import {Input, message, Modal, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import style from './index.pcss'
import {connect} from "react-redux";
import {addUser} from "../../src/reducers/user";

@connect(
  state => ({socketInit: state.socket.socketInit, user: state.user}),
  {addUser}
)
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  userNameChange = e => this.props.addUser({userName: e.target.value})

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持图片格式!');
    }
    return isJpgOrPng
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        this.setState({loading: false})
        this.props.addUser({imageUrl: `https://localhost:8080/img/${info.file.response.msg}`})
      } else {
        this.setState({loading: false})
        this.props.addUser({imageUrl: ''})
        message.error(info.file.response.msg)
      }
    }
  }

  userLogin = () => {
    const {userName, imageUrl} = this.props.user
    if (!userName.trim()) {
      message.error("请输入登陆用户名!")
      return
    }
    this.props.addUser({userName: userName.trim()})
    if (!imageUrl) {
      message.error("请上传头像")
      return;
    }
    this.props.socketInit()
    this.props.closeLogin()
  }

  loginWarning = () => message.error("请登录!")

  render() {
    const {loading} = this.state
    const {userName, imageUrl} = this.props.user
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div style={{marginTop: 8}}>上传</div>
      </div>
    );
    return (
      <>
        <Modal title="登陆" visible={this.props.isLoginVisible} onOk={this.userLogin} onCancel={this.loginWarning}>
          <div className={style.rows}>
            <span className={style.title}><span>*</span>用户名</span>
            <div className={style.inputArea}>
              <Input maxLength={12} value={userName} onChange={this.userNameChange} placeholder="请输入用户名"/>
            </div>
          </div>
          <div className={[style.rows, style.top].join(' ')}>
            <span className={style.title}><span>*</span>头像</span>
            <div className={style.inputArea}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://localhost:8080/uploadImg"
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
              </Upload>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default Login