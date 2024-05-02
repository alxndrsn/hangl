import { Component } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import NumberInput from './NumberInput';
import SecondsInput from './SecondsInput';
import datastore from './datastore';
import withRouter from './withRouter';

const Fieldset = ({ children, label, ...props }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h5" gutterBottom textAlign="center">{label}</Typography>
      <Grid container alignItems="center">
        {children}
      </Grid>
    </CardContent>
  </Card>
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Fieldset label="Each Set">
            <Grid item xs={12} sm={6} textAlign="center">
              <SecondsInput label="Active" value={this.state.params['set.active']} onChange={this.setParam('set.active')}/>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="center">
              <SecondsInput label="Rest"   value={this.state.params['set.rest']}   onChange={this.setParam('set.rest')}/>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <NumberInput  label="Reps"   value={this.state.params['set.reps']}   onChange={this.setParam('set.reps')}/>
            </Grid>
          </Fieldset>
        </Grid>
        <Grid item xs={12}>
          <Fieldset label="Each Session">
            <Grid item xs={12} sm={6} textAlign="center">
              <SecondsInput label="Rest" value={this.state.params['session.rest']} onChange={this.setParam('session.rest')}/>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="center">
              <NumberInput  label="Sets" value={this.state.params['session.sets']} onChange={this.setParam('session.sets')}/>
            </Grid>
          </Fieldset>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <ActionButton onClick={this.start} label="Start"/>
        </Grid>

        <Grid item xs={12}>
          <div>
            <h3>debug - current state</h3>
            <pre>
              <code>
                {JSON.stringify(this.state, null, 2)}
              </code>
            </pre>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(SessionParamsPage);
