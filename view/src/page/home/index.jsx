import React from 'react';
import style from './index.pcss'
import {PhotoSlider} from "react-photo-view";
import UserList from "../../../components/user-list";
import MessageArea from "./message-area";
import UserMessage from "./user-message";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgPreview: '',
            isImgPreview: false
        }
        this.content = React.createRef()
    }

    componentDidMount() {

    }

    closeImgPreview = () => this.setState({isImgPreview: false})

    fileDownLoad = () => {

    }

    render() {
        return (
            <>
                <UserList/>
                <div className={style.contentArea} ref={this.content}>
                    <MessageArea/>
                    <UserMessage/>
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
                                    onClick={this.fileDownLoad}
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
            </>
        );
    }
}

export default Home;