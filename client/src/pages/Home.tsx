import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getCfHandleFromStorage, setCfHandleToStorage } from "utils/userUtils";

export default function Home() {
  const [cfHandle, setCfHandle] = useState(getCfHandleFromStorage());
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
    // TODO: Check if user exists on Codeforces.
    if (true) {
      setCfHandle(cfHandleInput);
      setCfHandleInput("");
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Codeforces handle");
    }
  };

  return (
    <>
      <h1>Competitive Programming Web App</h1>
      {cfHandle === "" ? (
        <p>No Codeforces handle specified.</p>
      ) : (
        <p>
          Current Codeforces handle: <b>{cfHandle}</b>{" "}
          {/* TODO: Color user name with their rating. */}
        </p>
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
