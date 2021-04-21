import React from 'react'
import {Input, message, Modal, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import style from './index.pcss'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      loading: false,
      imageUrl: ''
    }
  }

  userNameChange = e => this.setState({userName: e.target.value})

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
        this.setState({imageUrl: `https://t-register.aegis-info.com/img/${info.file.response.msg}`, loading: false})
      } else {
        this.setState({imageUrl: '', loading: false})
        message.error(info.file.response.msg)
      }
    }
  };

  render() {
    const {userName, loading, imageUrl} = this.state
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div style={{marginTop: 8}}>上传</div>
      </div>
    );
    return (
      <>
        <Modal title="登陆" visible={true}>
          <div className={style.rows}>
            <span className={style.title}><span>*</span>用户名</span>
            <div className={style.inputArea}>
              <Input maxLength={12} value={userName} onChange={this.userNameChange} placeholder="请输入用户名"/>
            </div>
          </div>
          <div className={style.rows}>
            <span className={style.title}><span>*</span>头像</span>
            <div className={style.inputArea}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://t-register.aegis-info.com/uploadImg"
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