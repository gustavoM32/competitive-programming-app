import { Grid } from "@mui/material";

export const SpacedRow = ({ children }: any) => {
  return (
    <Grid
      container
      direction="row"
      spacing={1}
      margin={0}
      padding={1}
      alignItems="center"
      justifyContent="left"
    >
      {children.map((el: any, index: number) => (
        <Grid item key={index}>
          {el}
        </Grid>
      ))}
    </Grid>
  );
};
