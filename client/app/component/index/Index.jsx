import React from 'react';
import '@/css/common/common.pcss';
import './index.pcss';
import style from './index.pcss.json';
import { Button } from 'antd';

class Index extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={ style.init }>
        <Button type="primary">Primary</Button>
      </div>
    );
  }
}

export default Index;
