import Grid from '@mui/material/Grid';

const StateDebugPane = ({ state }) => process.env.NODE_ENV === 'production' ? null : (
  <Grid item xs={12}>
    <div>
      <h3>debug - current state</h3>
      <pre>
        <code>
          {JSON.stringify(state, null, 2)}
        </code>
      </pre>
    </div>
  </Grid>
);
export default StateDebugPane;
