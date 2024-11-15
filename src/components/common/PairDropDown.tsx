import { ALLOWED_PAIRS } from '@app/constants/app-constants';
import  useExchangeStore  from '@app/hooks/useExchangeStore';
import { CoinPair } from '@app/types/types';
import { isAllowedPair } from '@app/utils/utils';
import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PairDropDown() {
  const navigate = useNavigate();
  const params = useParams();
  const [pairname, setPairname] = useState<string>(params?.id || '');
  const { switchPair } = useExchangeStore();

  useEffect(() => {
    if (params?.id && isAllowedPair(params.id)) {
      const pair = params.id as CoinPair;
      setPairname(pair);
      switchPair(pair);
    } else {
      setPairname('-');
    }
  }, [params.id]);

  const changeRoute = (event: SelectChangeEvent) => {
    const { value } = event.target;
    navigate(`/exchange/${value}`);
  };

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <InputLabel id="currency-pair-label">Selected Currency Pair</InputLabel>
      <Select
        labelId="currency-pair-label"
        value={pairname}
        onChange={changeRoute}
        size="small"
      >
        {ALLOWED_PAIRS.map((pair: string) => (
          <MenuItem key={pair} value={pair}>
            {pair}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}

export default PairDropDown;
