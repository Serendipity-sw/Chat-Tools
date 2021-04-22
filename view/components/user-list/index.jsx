import React from 'react';
import style from './index.pcss'
import {connect} from "react-redux";
import {addChat} from "../../src/reducers/chat";

@connect(
  state => ({selectUser: state.chat.selectUser, userList: state.socketMessage.userList}),
  {addChat}
)
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.userListDom = React.createRef()
  }

  userListProcess = () => {
    let domArray = []
    const {selectUser, userList} = this.props
    for (const [key, value] of Object.entries(userList)) {
      domArray.push(
        <li className={selectUser === key && style.select}
            onClick={() => this.selectUserClick(key)}>{value.name}</li>
      )
    }
    return domArray
  }

  selectUserClick = selectUser => {
    this.props.addChat({selectUser})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.userListDom.current.scrollTo({
      top: this.userListDom.current.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
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