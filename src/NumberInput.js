import { Component } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const Unit = ({ u }) => <InputAdornment position="end">{u}</InputAdornment>;

const validationError = msg => new Error('Validation failed:' + msg);

export default class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value:this.props.value || '', dirty:false };
  }

  onChange = e => {
    const { value } = e.target;
    this.setState({ value, dirty:true });
  };

  propagateChange = () => {
    const { value, dirty } = this.state;
    if(!dirty) return;

    const { onChange } = this.props;
    if(!onChange) return;

    const numValue = Number(value);
    if(isNaN(numValue)) throw validationError('not a number');

    const intValue = Math.floor(numValue);
    if(intValue != numValue) throw validationError('not an integer');

    if(intValue < 0) throw validationError('less than zero');

    this.props.onChange(intValue);
  };

  render() {
    const { label, unit } = this.props;
    const { value } = this.state;

    return (
      <TextField
        label={label}
        sx={{ m:1, width:'25ch' }}
        InputProps={{
          endAdornment: unit ? <Unit u={unit}/> : undefined,
        }}
        onChange={this.onChange}
        onBlur={this.propagateChange}
        value={value}
      />
    );
  }
}
