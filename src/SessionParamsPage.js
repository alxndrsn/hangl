import { Component } from 'react';

import Button from '@mui/material/Button';

import NumberInput from './NumberInput';
import SecondsInput from './SecondsInput';
import datastore from './datastore';
import withRouter from './withRouter';

const Fieldset = ({ children, label, ...props }) => (
  <fieldset {...props}>
    <legend>{label}</legend>
    {children}
  </fieldset>
);

const ActionButton = ({ label, ...props }) => <Button variant="contained" {...props}>{label}</Button>;

const defaultParams = {
  'set.active':    12,
  'set.rest':      60,
  'set.reps':       3,
  'session.rest': 180,
  'session.sets':   4,
};

class SessionParamsPage extends Component {
  constructor(props) {
    super(props);

    const params = datastore.loadParams() || defaultParams;
    this.state = { params };
  }

  start = () => {
    datastore.saveParams(this.state.params);
    this.props.navigate('/active');
  };

  setParam = name => v => {
    console.log('setParam()', name, v);
    this.setState(prevState => {
      const prevParams = prevState.params;
      return {
        params: { ...prevParams, [name]:v },
      };
    });
  };

  render() {
    return (
      <>
        <Fieldset label="Each Set">
          <SecondsInput label="Active" value={this.state.params['set.active']} onChange={this.setParam('set.active')}/>
          <SecondsInput label="Rest"   value={this.state.params['set.rest']}   onChange={this.setParam('set.rest')}/>
          <NumberInput  label="Reps"   value={this.state.params['set.reps']}   onChange={this.setParam('set.reps')}/>
        </Fieldset>
        <Fieldset label="Each Session">
          <SecondsInput label="Rest" value={this.state.params['session.rest']} onChange={this.setParam('session.rest')}/>
          <NumberInput  label="Sets" value={this.state.params['session.sets']} onChange={this.setParam('session.sets')}/>
        </Fieldset>
        <ActionButton onClick={this.start} label="Start"/>

        <div>
          <h3>debug - current state</h3>
          <pre>
            <code>
              {JSON.stringify(this.state, null, 2)}
            </code>
          </pre>
        </div>
      </>
    );
  }
}

export default withRouter(SessionParamsPage);
