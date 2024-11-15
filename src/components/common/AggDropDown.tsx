import { AGG_VALUES } from '@app/constants/app-constants';
import useExchangeStore from '@app/hooks/useExchangeStore';
import { InputLabel, MenuItem, Select, Stack } from '@mui/material';

function AggDropDown() {
  const { aggregationValue, setAggregationValue } = useExchangeStore();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <InputLabel id="currency-pair-label">Selected Aggregate Value</InputLabel>
      <Select
        labelId="currency-pair-label"
        value={aggregationValue}
        onChange={(e) => setAggregationValue(Number(e.target.value))}
        size="small"
      >
        {AGG_VALUES.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}

export default AggDropDown;
