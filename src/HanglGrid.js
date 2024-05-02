import Grid from '@mui/material/Grid';

export const GridContainer = ({ children }) => <Grid container spacing={2}>{children}</Grid>;
export const GridFullRow = ({ children }) => <Grid item xs={12}        textAlign="center">{children}</Grid>;
export const GridHalfRow = ({ children }) => <Grid item xs={12} sm={6} textAlign="center">{children}</Grid>;
