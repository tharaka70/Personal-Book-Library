import * as React from 'react';
// import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MyDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DatePicker label="Published Date"  />
    </LocalizationProvider>
  );
}