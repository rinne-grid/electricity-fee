import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';

export const ElectricityBaseBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  margin: '5px',
});

export const ElectricityBaseTextField = styled(TextField)({
  margin: 10,
  '.MuiInputBase-input': {
    textAlign: 'right',
  },
});

export const ElectricityAmountTextField = styled(ElectricityBaseTextField)({
  width: '50%',
  '.MuiInputBase-input': {
    fontSize: '2rem',
    textAlign: 'center',
    inputMode: 'number',
  },
});

export const ElectricityAmountBox = styled('div')({
  justifyContent: 'center',
  display: 'flex',
  margin: 10,
});
