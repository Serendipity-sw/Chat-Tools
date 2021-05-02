import React from 'react'
import style from './index.pcss'
import {Checkbox, Input, Modal} from 'antd';
import {connect} from "react-redux";
import {decryptMessage} from "../../../util/aes";
import {message} from "antd/es";
import {aesKey} from "../../../util/httpConfig";
import CryptoJS from "crypto-js";

@connect(
  state => ({socket: state.socket.socket, user: state.user, userList: state.socketMessage.userList}),
  {}
)
class DiscussionGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectUser: [],
      groupName: ''
    }
  }

  checkboxOptionProcess = () => {
    let userList = []
    for (const [key, value] of Object.entries(this.props.userList)) {
      userList.push({label: decryptMessage(value.name), value: key})
    }
    return userList
  }

  onChange = selectUser => this.setState({selectUser})

  closeDiscussionGroupDialog = () => {
    this.setState({selectUser: [], groupName: ''})
    this.props.closeDiscussionGroupDialog()
  }

  addGroupClick = () => {
    const {selectUser, groupName} = this.state
    if (!groupName.trim()) {
      message.error("请输入群名称!")
      return
    }
    if (selectUser.length === 0) {
      message.error("请选择添加到讨论组的人!")
      return
    }
    this.props.socket.send(JSON.stringify({
      type: 2,
      msg: '',
      img: '',
      name: CryptoJS.AES.encrypt(groupName, aesKey).toString(),
      send_id: '',
      result_id: '',
      user_list: [...selectUser, this.props.user.id]
    }))
    this.closeDiscussionGroupDialog()
  }

  groupNameChange = e => this.setState({groupName: e.target.value})

  render() {
    return (
      <Modal
        title="新增群聊"
        centered
        visible={this.props.discussionDialogVisible}
        onOk={this.addGroupClick}
        onCancel={this.closeDiscussionGroupDialog}
      >
        <div className={style.init}>
          <div className={style.rows}>
            <span className={style.column}>群名:</span>
            <Input maxLength={10} value={this.state.groupName} placeholder="请输入群名" onChange={this.groupNameChange}/>
          </div>
          <div className={style.rows}>
            <span className={style.column}>人员:</span>
            <Checkbox.Group options={this.checkboxOptionProcess()} value={this.state.selectUser}
                            onChange={this.onChange}/>
          </div>
        </div>
      </Modal>
    )
  }
}

export default DiscussionGroup