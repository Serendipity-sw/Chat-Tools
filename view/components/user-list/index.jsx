import React from 'react';
import style from './index.pcss'
import {connect} from "react-redux";
import {addChat} from "../../src/reducers/chat";
import DiscussionGroup from "./discussion-group";
import {decryptMessage} from '../../util/aes'

@connect(
  state => ({selectUser: state.chat.selectUser, userList: state.socketMessage.userList}),
  {addChat}
)
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      discussionDialogVisible: false
    }
    this.userListDom = React.createRef()
  }

  userListProcess = () => {
    let domArray = []
    const {selectUser, userList} = this.props
    for (const [key, value] of Object.entries(userList)) {
      domArray.push(
        <li key={key} data-user={key} className={selectUser === key ? style.select : ''}
            onClick={() => this.selectUserClick(key)}>{decryptMessage(value.name)}</li>
      )
    }
    return domArray
  }

  selectUserClick = selectUser => {
    this
      .props
      .addChat({selectUser})
  }

  closeDiscussionGroupDialog = () => this.setState({discussionDialogVisible: false})

  addGroupClick = () => this.setState({discussionDialogVisible: true})

  render() {
    return (
      <div className={style.init} ref={this.userListDom}>
        <ul>
          {
            this.userListProcess()
          }
        </ul>
        <span onClick={this.addGroupClick} className={style.addGroup}>讨论组</span>
        <DiscussionGroup closeDiscussionGroupDialog={this.closeDiscussionGroupDialog}
                         discussionDialogVisible={this.state.discussionDialogVisible}/>
      </div>
    );
  }
}

export default UserList;