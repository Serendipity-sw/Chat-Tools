import React from 'react';
import style from './index.pcss'
import {connect} from "react-redux";
import {addChat} from "../../src/reducers/chat";
import CryptoJS from "crypto-js";
import {aesKey} from "../../util/httpConfig";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {Modal} from "antd";
import DiscussionGroup from "./discussion-group";

@connect(
  state => ({selectUser: state.chat.selectUser, userList: state.socketMessage.userList}),
  {addChat}
)
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectGroupUser: '',
      discussionDialogVisible: false
    }
    this.userListDom = React.createRef()
  }

  decryptMessage = message => {
    const bytes = CryptoJS.AES.decrypt(message, aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  userListProcess = () => {
    let domArray = []
    const {selectUser, userList} = this.props
    for (const [key, value] of Object.entries(userList)) {
      domArray.push(
        <ContextMenuTrigger key={value.name} id="same_unique_identifier">
          <li data-user={key} className={selectUser === key ? style.select : ''}
              onClick={() => this.selectUserClick(key)}>{this.decryptMessage(value.name)}</li>
        </ContextMenuTrigger>
      )
    }
    return domArray
  }

  selectUserClick = selectUser => {
    this
      .props
      .addChat({selectUser})
  }

  addDiscussionGroup = (e, data) => {
    switch (data.type) {
      case 'addDiscussionGroup':
        this.setState({
          groupUser: data.target.getAttribute('data-user'),
          discussionDialogVisible: true
        })
        break
    }
  }

  closeDiscussionGroupDialog = () => this.setState({discussionDialogVisible: false})

  render() {
    return (
      <div className={style.init} ref={this.userListDom}>
        <ul>
          {
            this.userListProcess()
          }
        </ul>
        <DiscussionGroup closeDiscussionGroupDialog={this.closeDiscussionGroupDialog}
                         discussionDialogVisible={this.state.discussionDialogVisible}
                         selectGroupUser={this.state.selectGroupUser}/>
        <ContextMenu className={style.rightMenuArea} id="same_unique_identifier">
          <MenuItem className={style.menu} data={{type: 'addDiscussionGroup'}} onClick={this.addDiscussionGroup}>
            添加讨论组
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default UserList;