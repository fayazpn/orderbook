import { Button } from '@mui/material';

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode | string;
};
function ActionButton({ onClick, children }: ActionButtonProps) {
  return (
    <Button onClick={onClick} size="small" variant="outlined">
      {children}
    </Button>
  );
}

export default ActionButton;
