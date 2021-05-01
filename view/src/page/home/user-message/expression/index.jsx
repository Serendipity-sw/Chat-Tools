import React from 'react'
import style from './index.pcss'
import {message, Modal, Tabs, Upload} from "antd";
import {httpConfig} from "../../../../../util/httpConfig";
import {ExclamationCircleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {connect} from "react-redux";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";

const {TabPane} = Tabs
const {confirm} = Modal;

@connect(
  state => ({socket: state.socket.socket, user: state.user, selectUser: state.chat.selectUser}),
  {}
)
class Expression extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      expression: []
    }
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
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
      this.setState({loading: false})
      if (info.file.response.code === 200) {
        const {expression} = this.state
        this.setState({expression: [...expression, `${httpConfig}/file/${info.file.response.msg}`]})
      } else {
        message.error(info.file.response.msg)
      }
    }
  }

  rightMenuClick = (e, data) => {
    switch (data.type) {
      case 'delExpression':
        confirm({
          title: '确定删除该表情么?',
          icon: <ExclamationCircleOutlined/>,
          content: '表情删除后不可恢复!',
          okText: '确定!',
          okType: 'danger',
          cancelText: '你猜?',
          onOk: () => {
            let expression = this.state.expression
            expression.splice(data.target.getAttribute('data-index'), 1)
            this.setState({expression})
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break
    }
  }

  sendExpression = msg => {
    this.props.socket.send(JSON.stringify({
      type: 4,
      msg,
      img: '',
      name: '',
      send_id: this.props.user.id,
      result_id: this.props.selectUser,
      user_list: []
    }))
  }

  render() {
    return (
      <div className={style.init}>
        <Tabs className={style.fullScreen} defaultActiveKey="1" tabPosition="bottom" size="small">
          <TabPane tab="表情" key="1" className={style.fullScreen}>
            <div className={style.tableArea}>
              {
                this.state.expression.map((item, index) =>
                  <div key={item} className={style.column}>
                    <ContextMenuTrigger id="same_unique_identifier">
                      <img data-index={index} className={style.expression} onClick={() => {
                        this.sendExpression(item)
                      }} src={item} alt=""/>
                    </ContextMenuTrigger>
                  </div>
                )
              }
              <div className={style.column}>
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action={`${httpConfig}/uploadFile`}
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                  <div>
                    {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                  </div>
                </Upload>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <ContextMenu className={style.rightMenuArea} id="same_unique_identifier">
          <MenuItem className={style.menu} data={{type: 'delExpression'}} onClick={this.rightMenuClick}>
            删除
          </MenuItem>
        </ContextMenu>
      </div>
    )
  }
}

export default Expression