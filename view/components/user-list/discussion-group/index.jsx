import React from 'react'
import style from './index.pcss'
import {Checkbox, Modal} from 'antd';
import {connect} from "react-redux";

@connect(
  state => ({userList: state.socketMessage.userList}),
  {}
)
class DiscussionGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectUser: [props.selectGroupUser]
    }
  }

  checkboxOptionProcess = () => {
    let userList = []
    for (const [key, value] of Object.entries(this.props.userList)) {
      userList.push({label: value.name, value: key})
    }
    return userList
  }

  onChange = selectUser => this.setState({selectUser})

  render() {
    return (
      <Modal
        title="新增群聊"
        centered
        visible={this.props.discussionDialogVisible}
        onOk={() => this.props.closeDiscussionGroupDialog()}
        onCancel={() => this.props.closeDiscussionGroupDialog()}
      >
        <div className={style.init}>
          <Checkbox.Group options={this.checkboxOptionProcess()} onChange={this.onChange}/>
        </div>
      </Modal>
    )
  }
}

export default DiscussionGroup