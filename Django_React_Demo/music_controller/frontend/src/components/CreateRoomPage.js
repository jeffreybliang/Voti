import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Collapse,
} from "@material-ui/core";
import { useNavigate, Link } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
  errorMsg = "",
  successMsg = "",
}) => {
  const [votesToSkipState, setVotesToSkip] = useState(votesToSkip);
  const [guestCanPauseState, setGuestCanPause] = useState(guestCanPause);
  const [errorMsgState, setErrorMsg] = useState(errorMsg);
  const [successMsgState, setSuccessMsg] = useState(successMsg);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          setSuccessMsg("Room updated successfully!");
        } else {
          setErrorMsg("Error updating room.");
        }
        updateCallback(); // Call callback function if provided
      })
      .catch((error) => {
        console.error("Error creating room:", error);
        setErrorMsg("Error creating room.");
        updateCallback();
      });
  };

  useEffect(() => {
    if (successMsgState || errorMsgState) {
      setShowAlert(true);
    }
  }, [successMsgState, errorMsgState]);

  const title = update ? "Update Room" : "Create A Room";

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <Collapse in={showAlert}>
      {successMsgState ? (
            <Alert severity="success" onClose={() => { setSuccessMsg(""); setShowAlert(false); }}>
              {successMsgState}
            </Alert>
          ) : (
            errorMsgState && (
              <Alert severity="error" onClose={() => { setErrorMsg(""); setShowAlert(false); }}>
                {errorMsgState}
              </Alert>
            )
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center"> Guest Control of Playback State </div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPauseState.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
