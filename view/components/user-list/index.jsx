import React from 'react';
import style from './index.pcss'
import {connect} from "react-redux";
import {addChat} from "../../src/reducers/chat";
import CryptoJS from "crypto-js";
import {aesKey} from "../../util/httpConfig";

@connect(
  state => ({selectUser: state.chat.selectUser, userList: state.socketMessage.userList}),
  {addChat}
)
class UserList extends React.Component {
  constructor(props) {
    super(props);
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
        <li key={value.name} className={selectUser === key ? style.select : ''}
            onClick={() => this.selectUserClick(key)}>{this.decryptMessage(value.name)}</li>
      )
    }
    return domArray
  }

  selectUserClick = selectUser => {
    this.props.addChat({selectUser})
  }

  render() {
    return (
      <div className={style.init} ref={this.userListDom}>
        <ul>
          {
            this.userListProcess()
          }
        </ul>
      </div>
    );
  }
}

export default UserList;