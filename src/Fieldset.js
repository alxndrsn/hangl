import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
export default Fieldset;
