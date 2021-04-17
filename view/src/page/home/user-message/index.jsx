import React from 'react'
import style from './index.pcss'

class UserMessage extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className={style.init}>
        <div className={style.toolBox}>
          <i className={style.expression}>&#xe602;</i>
          <i className={style.expression}>&#xe62b;</i>
        </div>
        <textarea className={style.inputArea}/>
      </div>
    )
  }
}

export default UserMessage