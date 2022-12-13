import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import { CircularProgress, Grid } from "@mui/material";

type Information = {
  isRefetching?: boolean;
  isUpdating?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

type DataLoadingInfoProps = {
  information: Information[];
};

export const DataLoadingInfo = ({ information }: DataLoadingInfoProps) => {
  let symbol;
  let text;

  const refetching = information.some(
    (el: Information) => el?.isRefetching ?? false
  );

  const isUpdating = information.some(
    (el: Information) => el?.isUpdating ?? false
  );

  const isError = information.some((el: Information) => el?.isError ?? false);

  const isSuccess = information.some(
    (el: Information) => el?.isSuccess ?? false
  );

  if (!refetching && !isUpdating) {
    if (isError) {
      symbol = <ErrorIcon color="error" />;
      text = "Error loading data";
    } else if (isSuccess) {
      symbol = <CheckCircleIcon color="success" />;
      text = "Data loaded";
    } else {
      symbol = <HelpIcon color="warning" />;
      text = "Data not loaded";
    }
  } else {
    symbol = (
      <CircularProgress
        size={20}
        color={refetching ? "primary" : "secondary"}
      />
    );
    text = refetching ? "Loading data..." : "Server is updating CF data...";
  }

  return (
    <Grid
      container
      spacing={0.5}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>{symbol}</Grid>
      <Grid item>{text}</Grid>
    </Grid>
  );
};
