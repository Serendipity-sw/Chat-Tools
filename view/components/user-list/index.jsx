import React from 'react';
import style from './index.pcss'

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.userListDom = React.createRef()
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={style.init} ref={this.userListDom}>
                <ul>
                    <li>user1</li>
                    <li className={style.select}>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                    <li>user1</li>
                </ul>
            </div>
        );
    }
}

export default UserList;