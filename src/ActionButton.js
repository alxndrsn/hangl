import Button from '@mui/material/Button';

const ActionButton = ({ label, ...props }) => <Button variant="contained" {...props}>{label}</Button>;
export default ActionButton;
