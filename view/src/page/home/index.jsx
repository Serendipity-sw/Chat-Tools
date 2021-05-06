import React from 'react';
import style from './index.pcss'
import UserList from "../../../components/user-list";
import MessageArea from "./message-area";
import UserMessage from "./user-message";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        <UserList/>
        <div className={style.contentArea}>
          <MessageArea/>
          <UserMessage/>
        </div>
      </>
    );
  }
}

export default Home;
