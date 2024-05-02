import { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { GridContainer, GridFullRow, GridHalfRow } from './HanglGrid';
import ActionButton from './ActionButton';
import Fieldset from './Fieldset';
import StateDebugPane from './StateDebugPane';
import Unit from './Unit';
import datastore from './datastore';
import withRouter from './withRouter';

/* eslint-disable no-lone-blocks */

const now = () => typeof performance?.now === 'function' ? performance.now() : Date.now();

// Match style of NumberInput, but completely uncontrolled
// TODO handle active prop
const Number = ({ label, unit, value }) => (
  <TextField
    disabled
    label={label}
    sx={{ m:1, width:'25ch' }}
    InputProps={{
      endAdornment: unit ? <Unit u={unit}/> : undefined,
    }}
    value={value}
  />
);
const Seconds = props => <Number unit="s" {...props}/>

class SessionActivePage extends Component {
  constructor(props) {
    super(props);

    const params = datastore.loadParams();
    this.state = { params, current:this.freshCurrent(params) };
  }

  componentDidMount() {
    if(!this.state.params) this.props.navigate('/settings'); // params failed to load
  }

  componentWillUnmount() {
    clearInterval(this.state.ticker);
  }

  freshCurrent = (params) => {
    if(!params) params = this.state.params;

    return {
      countdown: 3000,
      nextBeep: 3000,
      'set.active':   params['set.active']   * 1000,
      'set.rest':     params['set.rest']     * 1000,
      'set.reps':     params['set.reps'],
      'session.rest': params['session.rest'] * 1000,
      'session.sets': params['session.sets'],
    };
  };

  start = () => {
    this.setState(prevState => {
      const current = this.freshCurrent();
      // TODO add countdown into the whole session as sessionState:'start-countdown' or something
      this.setState({ current, inProgress:true, msPassed:0, sessionState:'countdown' }, this.resume);
    });
  };
  pause = () => {
    clearInterval(this.state.ticker);
    this.setState(prevState => {
      const { msPassed, resumedAt } = prevState;
      return { ticktock:false, msPassed:msPassed + (now()-resumedAt), ticker:null };
    });
  };
  resume = () => {
    // TODO deal with partial seconds from pausing
    const resumedAt = now();
    const ticker = setInterval(this.tick, 10);
    this.setState(prevState => {
      if(prevState.ticker) clearInterval(prevState.ticker); // react dev mode?
      return { ticktock:true, resumedAt, ticker };
    });
  };
  tick = () => {
    this.setState(prevState => {
      const rightNow = now();
      const sinceLastTick = rightNow - prevState.resumedAt;
      const resumedAt = rightNow;

      const current = { ...prevState.current };
      let { sessionState } = prevState;

      switch(sessionState) {
        case 'countdown': {
          current.countdown -= sinceLastTick;
          if(current.countdown <= 0) {
            this.playBeep(2); current.nextBeep = 3000;
            sessionState = 'set-active';
          } else if(current.countdown < current.nextBeep) {
            this.playBeep(1); current.nextBeep -= 1000;
          }
        } break;
        case 'set-active': {
          current['set.active'] -= sinceLastTick;
          if(current['set.active'] <= 0) {
            this.playBeep(2); current.nextBeep = 3000;
            current['set.active'] = 0;
            sessionState = 'set-rest';
          } else if(current['set.active'] < current.nextBeep) {
            this.playBeep(1); current.nextBeep -= 1000;
          }
        } break;
        case 'set-rest': {
          current['set.rest'] -= sinceLastTick;
          if(current['set.rest'] <= 0) {
            this.playBeep(2); current.nextBeep = 3000;
            if(--current['set.reps']) {
              current['set.active'] = prevState.params['set.active'] * 1000;
              current['set.rest']   = prevState.params['set.rest'] * 1000;
              sessionState = 'set-active';
            } else {
              current['set.rest'] = 0;
              sessionState = 'session-rest';
            }
          } else if(current['set.rest'] < current.nextBeep) {
            this.playBeep(1); current.nextBeep -= 1000;
          }
        } break;
        case 'session-rest': {
          current['session.rest'] -= sinceLastTick;
          if(current['session.rest'] <= 0) {
            this.playBeep(2); current.nextBeep = 3000;
            current['session.rest'] = 0;
            if(--current['session.sets']) {
              current['set.reps']     = prevState.params['set.reps'];
              current['set.active']   = prevState.params['set.active'] * 1000;
              current['set.rest']     = prevState.params['set.rest'] * 1000;
              current['session.rest'] = prevState.params['session.rest'] * 1000;
              sessionState = 'set-active';
            } else {
              clearInterval(this.state.ticker);
              return { current, sessionState:'completed', completed:true };
            }
          } else if(current['session.rest'] < current.nextBeep) {
            this.playBeep(1); current.nextBeep -= 1000;
          }
        } break;
        default: throw new Error(`TODO: no handling for sessionState: '${sessionState}'`);
      }

      // TODO update current

      return { current, resumedAt, sessionState, msPassed:prevState.msPassed + sinceLastTick };
    });
  };

  button = () => {
    const { completed, inProgress, ticktock } = this.state;

    if(completed)       return ['Reset',  this.reset];
    else if(ticktock)   return ['Pause',  this.pause];
    else if(inProgress) return ['Resume', this.resume];
    else                return ['Start',  this.start];
  };

  playBeep = async n => { // async so it doesn't block - should not await
    const audioElement = document.getElementById(`beep-${n}`);
    if(!this.beepinitialised) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const track = audioContext.createMediaElementSource(audioElement);
      track.connect(audioContext.destination);
      this.beepinitialised = true;
    }
    audioElement.play();
  };

  render() {
    const { current, sessionState, ticktock } = this.state;

    const [ btnLabel, btnAction ] = this.button();
    const button = <ActionButton onClick={btnAction} label={btnLabel}/>

    return (
      <GridContainer>
        <GridFullRow>
          <Fieldset label="Set">
            <GridHalfRow>
              <Seconds label="Active" value={toS(current['set.active'])} active={sessionState==='set-active'}/>
            </GridHalfRow>
            <GridHalfRow>
              <Seconds label="Rest"   value={toS(current['set.rest'])} active={sessionState==='set-rest'}/>
            </GridHalfRow>
            <GridHalfRow>
              <Number  label="Reps"   value={current['set.reps']}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          <Fieldset label="Session">
            <GridHalfRow>
              <Seconds label="Rest" value={toS(current['session.rest'])} active={sessionState==='session-rest'}/>
            </GridHalfRow>
            <GridHalfRow>
              <Number  label="Sets" value={current['session.sets']}/>
            </GridHalfRow>
          </Fieldset>
        </GridFullRow>
        <GridFullRow>
          {button}
        </GridFullRow>

        <GridFullRow>
          <Button variant="text" component={Link} disabled={ticktock} to="/settings">&lt; Settings</Button>
        </GridFullRow>

        <StateDebugPane state={this.state}/>
      </GridContainer>
    );
  }
}
export default withRouter(SessionActivePage);

function toS(remaining) {
  return (Math.ceil(remaining / 100) / 10).toFixed(1);
}
