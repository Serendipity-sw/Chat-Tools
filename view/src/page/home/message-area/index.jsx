import React from 'react';
import style from './index.pcss'
import {PhotoSlider} from "react-photo-view";
import {connect} from "react-redux";
import {decryptMessage} from '../../../../util/aes'
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {message} from "antd";
import {expressionChange} from "../../../reducers/expression";
import {httpConfig} from "../../../../util/httpConfig";

@connect(
  state => ({
    selectUser: state.chat.selectUser,
    socketMessage: state.socketMessage,
    user: state.user,
    loginUserAvatar: state.user.imageUrl,
    addExpressionFunc: state.expression,
    expression: state.expression
  }),
  {expressionChange}
)
class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgPreview: '',
      isImgPreview: false
    }

    this.content = React.createRef()
  }

  closeImgPreview = () => this.setState({isImgPreview: false})

  previewFileDownLoad = () => {
    this.fileDownLoad(this.state.imgPreview)
  }

  fileDownLoad = fileUrl => {
    const elt = document.createElement('a');
    elt.setAttribute('href', fileUrl);
    elt.setAttribute('download', fileUrl.split(/[\\\/]/).pop());
    elt.style.display = 'none';
    document.body.appendChild(elt);
    elt.click();
    document.body.removeChild(elt);
  }

  imgPreview = event => {
    this.setState({imgPreview: event.target.getAttribute('src'), isImgPreview: true})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    this.content.current.scrollTo({
      top: this.content.current.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  messageListProcess = () => {
    const {selectUser, socketMessage: {userList, messageList}} = this.props
    return messageList.filter(item => item.send_id === selectUser || item.result_id === selectUser).map((item, index) => {
      if (item.send_id !== this.props.user.id) {
        return <div key={index} className={style.otherSideArea}>
          <img className={style.otherSideIcon}
               src={userList[item.send_id] && userList[item.send_id].avatar}
               alt=""/>
          <div className={style.otherMessageArea}>
            {
              this.messageProcess(item)
            }
          </div>
        </div>
      } else {
        return <div key={index} className={style.userArea}>
          <img className={style.userMessageIcon}
               src={this.props.loginUserAvatar}
               alt=""/>
          <div className={style.userMessageArea}>
            {
              this.messageProcess(item)
            }
          </div>
        </div>
      }
    })
  }

  messageProcess = item => {
    return (
      <>
        <label> </label>
        <span className={style.message}>
          {
            item.type === 3 &&
            <ContextMenuTrigger id="same_unique_identifier">
              <img onClick={event => (this.imgPreview(event))}
                   src={item.msg}
                   onLoad={this.scrollToBottom}
                   alt=""/>
            </ContextMenuTrigger>
          }
          {
            item.type === 2 && decryptMessage(item.msg)
          }
          {
            item.type === 9 && <i onClick={() => {
              this.fileDownLoad(decryptMessage(item.msg))
            }} className={style.fileMessage}>&#xe671;</i>
          }
        </span>
      </>
    )
  }

  rightMenuClick = (e, data) => {
    switch (data.type) {
      case 'addExpression':
        const {expression} = this.props
        this.props.expressionChange([...expression, data.target.getAttribute('src')])
        message.success("表情添加成功")
        break
    }
  }

  render() {
    return (
      <>
        <div className={style.init} ref={this.content}>
          {
            this.messageListProcess()
          }
        </div>
        <PhotoSlider
          toolbarRender={({rotate, onRotate}) => {
            return (
              <>
                <svg
                  className="PhotoView-PhotoSlider__toolbarIcon"
                  onClick={() => onRotate(rotate + 90)}
                  width="44"
                  height="44"
                  fill="white"
                  viewBox="0 0 768 768"
                >
                  <path
                    d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z"/>
                </svg>
                <svg
                  className="PhotoView-PhotoSlider__toolbarIcon"
                  onClick={this.previewFileDownLoad}
                  width="44"
                  height="44"
                  fill="white"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M864 511.8c-17.7 0-32 14.3-32 32V864H192V543.8c0-17.7-14.3-32-32-32s-32 14.3-32 32V896c0 17.7 14.3 32 32 32h704c17.7 0 32-14.3 32-32V543.8c0-17.7-14.3-32-32-32zM488.7 687.3c6.1 7.3 15.1 11.5 24.6 11.5s18.5-4.2 24.6-11.5l177-212.3c11.3-13.6 9.5-33.8-4.1-45.1-13.6-11.3-33.8-9.5-45.1 4.1L544.5 579.3V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v449.6L360.8 434c-11.3-13.6-31.5-15.4-45.1-4.1-13.6 11.3-15.4 31.5-4.1 45.1l177.1 212.3z"/>
                </svg>
              </>
            );
          }}
          images={[{src: this.state.imgPreview}]}
          visible={this.state.isImgPreview}
          onClose={this.closeImgPreview}
        />
        <ContextMenu className={style.rightMenuArea} id="same_unique_identifier">
          <MenuItem className={style.menu} data={{type: 'addExpression'}} onClick={this.rightMenuClick}>
            添加到表情
          </MenuItem>
        </ContextMenu>
      </>
    )
  }
}

export default MessageArea