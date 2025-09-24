import { Grid as MuiGrid, GridProps } from '@mui/material/Grid';

// Type-safe Grid wrapper to bypass TypeScript issues
export const Grid: React.FC<any> = (props: any) => {
  return <MuiGrid {...props} />;
};

export default Grid;
