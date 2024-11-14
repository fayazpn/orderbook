import { Typography } from '@mui/material';

type SectionHeaderProps = {
  title: string;
  align?: 'left' | 'center' | 'right';
};

function SectionHeader({ title, align = 'left' }: SectionHeaderProps) {
  return (
    <Typography align={align} variant="h6">
      {title}
    </Typography>
  );
}

export default SectionHeader;
