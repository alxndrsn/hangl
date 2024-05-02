import { Component } from 'react';

import SessionActivePage from './SessionActivePage';
import SessionParamsPage from './SessionParamsPage';

const validActivities = ['active', 'params'];

class Hangl extends Component {
  state = {};

  setActivity = newActivity => {
    if(!validActivities.includes(newActivity)) throw new Error(`Unknown activity: ${newActivity}`);

    this.setState({ currentActivity:newActivity });
  };

  render() {
    const { currentActivity } = this.state;

    if(currentActivity === 'active') return <SessionActivePage setActivity={this.setActivity}/>;
    else return <SessionParamsPage setActivity={this.setActivity}/>;
  }
}
export default Hangl;
