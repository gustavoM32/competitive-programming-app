import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { readUpdatedInformation } from "api/updateInfo";
import { CfUserInfo } from "components/CfUserInfo";
import { useInformationList, useCreate } from "hooks/crudHooks";
import { useEffect, useState } from "react";
import { getCfHandleFromStorage, setCfHandleToStorage } from "utils/userUtils";

export default function Home() {
  const queryClient = useQueryClient();
  const userHandle = getCfHandleFromStorage();

  const [cfHandle, setCfHandle] = useState(userHandle);

  const cfUserKey = cfHandle.length > 0 ? ["cfUser"] : [];
  const cfUser = useInformationList(cfUserKey, {
    handle: cfHandle,
  });

  const createUser = useCreate(["users"]);

  const [cfHandleInput, setCfHandleInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCfHandleToStorage(cfHandle);
  }, [cfHandle]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setCfHandleInput(e.target.value);
    setErrorMessage("");
  };

  const handleClear = async () => {
    setCfHandle("");
    setCfHandleInput("");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (cfHandleInput.length === 0) {
      setErrorMessage("Field can't be empty");
      return;
    }

    const userInfo = await readUpdatedInformation(["cfUser"], {
      handle: cfHandleInput,
    });

    if (userInfo.resources.length === 1) {
      createUser({ username: cfHandleInput });
      setCfHandle(cfHandleInput);
      setCfHandleInput("");
      setErrorMessage("");
      queryClient.invalidateQueries();
    } else {
      setErrorMessage("Invalid Codeforces handle");
    }
  };

  const userInfo = cfUser.resources.length === 1 ? cfUser.resources[0] : null;

  return (
    <>
      <h1>Competitive Programming Web App</h1>
      {cfHandle === "" ? (
        <p>No Codeforces handle specified.</p>
      ) : userInfo == null ? (
        <Grid
          container
          spacing={0.5}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <CircularProgress size={20} color="primary" />
          </Grid>
          <Grid item>Loading user data...</Grid>
        </Grid>
      ) : (
        <CfUserInfo userInfo={userInfo} />
      )}
      <TextField
        error={errorMessage !== ""}
        helperText={errorMessage}
        margin="dense"
        onChange={handleChange}
        fullWidth
        value={cfHandleInput}
        name="cfHandleInput"
        label="CF user name"
      />
      <Button onClick={handleClear} color="warning">
        Unset
      </Button>
      <Button onClick={handleSubmit} color="primary">
        Set
      </Button>
    </>
  );
}
