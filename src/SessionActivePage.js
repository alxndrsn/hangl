import { Component } from 'react';

import { GridContainer, GridFullRow, GridHalfRow } from './HanglGrid';
import ActionButton from './ActionButton';
import Fieldset from './Fieldset';
import NumberInput from './NumberInput';
import SecondsInput from './SecondsInput';
import StateDebugPane from './StateDebugPane';
import datastore from './datastore';
import withRouter from './withRouter';

class SessionActivePage extends Component {
  constructor(props) {
    super(props);

    const params = datastore.loadParams();

    this.state = { params, current:{ ...params } };
  }

  componentDidMount() {
    if(!this.state.params) this.props.navigate('/settings'); // params failed to load
  }

  start = () => {
    this.setState(prevState => {
      const current = { ...prevState.params };
      this.setState({ current, ticktock:true, inProgress:true });
    });
  };
  pause  = () => this.setState({ ticktock:false });
  resume = () => this.setState({ ticktock:true });

  render() {
    const { current, inProgress, ticktock } = this.state;

    const btnAction = ticktock ? this.pause : inProgress ? this.resume : this.start;
    const btnLabel  = ticktock ? 'Pause'    : inProgress ? 'Resume'    : 'Start';
    const button = <ActionButton onClick={btnAction} label={btnLabel}/>

    return (
      <GridContainer>
        <GridFullRow>
          <Fieldset label="Set">
            <GridHalfRow>
              <SecondsInput label="Active" disabled value={current['set.active']}/>
            </GridHalfRow>
            <GridHalfRow>
              <SecondsInput label="Rest"   disabled value={current['set.rest']}/>
            </GridHalfRow>
            <GridHalfRow>
              <NumberInput  label="Reps"   disabled value={current['set.reps']}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          <Fieldset label="Session">
            <GridHalfRow>
              <SecondsInput label="Rest" disabled value={current['session.rest']}/>
            </GridHalfRow>
            <GridHalfRow>
              <NumberInput  label="Sets" disabled value={current['session.sets']}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          {button}
        </GridFullRow>

        <StateDebugPane state={this.state}/>
      </GridContainer>
    );
  }
}
export default withRouter(SessionActivePage);
