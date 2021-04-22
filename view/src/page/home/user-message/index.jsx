import React from 'react'
import style from './index.pcss'
import {connect} from "react-redux";

@connect(
  state => ({socket: state.socket.socket, user: state.user, selectUser: state.chat.selectUser}),
  {}
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
        content: this.state.message,
        img: '',
        name: '',
        send_id: this.props.user.id,
        result_id: this.props.selectUser,
        user_list: []
      }))
      this.setState({message: ''})
    }
  }

  render() {
    return (
      <div className={style.init}>
        <div className={style.toolBox}>
          <i className={style.expression}>&#xe602;</i>
          <i className={style.expression}>&#xe62b;</i>
        </div>
        <textarea value={this.state.message} onChange={this.messageChange} onKeyDown={this.enterPress}
                  className={style.inputArea}/>
      </div>
    )
  }
}

export default UserMessage