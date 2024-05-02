import { Component } from 'react';

import { GridContainer, GridFullRow, GridHalfRow } from './HanglGrid';
import ActionButton from './ActionButton';
import Fieldset from './Fieldset';
import NumberInput from './NumberInput';
import SecondsInput from './SecondsInput';
import StateDebugPane from './StateDebugPane';
import datastore from './datastore';
import withRouter from './withRouter';

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

  saveParams = () => {
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
      <GridContainer>
        <GridFullRow>
          <Fieldset label="Each Set">
            <GridHalfRow>
              <SecondsInput label="Active" value={this.state.params['set.active']} onChange={this.setParam('set.active')}/>
            </GridHalfRow>
            <GridHalfRow>
              <SecondsInput label="Rest"   value={this.state.params['set.rest']}   onChange={this.setParam('set.rest')}/>
            </GridHalfRow>
            <GridHalfRow>
              <NumberInput  label="Reps"   value={this.state.params['set.reps']}   onChange={this.setParam('set.reps')}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          <Fieldset label="Each Session">
            <GridHalfRow>
              <SecondsInput label="Rest" value={this.state.params['session.rest']} onChange={this.setParam('session.rest')}/>
            </GridHalfRow>
            <GridHalfRow>
              <NumberInput  label="Sets" value={this.state.params['session.sets']} onChange={this.setParam('session.sets')}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          <ActionButton onClick={this.saveParams} label="Save"/>
        </GridFullRow>

        <StateDebugPane state={this.state}/>
      </GridContainer>
    );
  }
}
export default withRouter(SessionParamsPage);
