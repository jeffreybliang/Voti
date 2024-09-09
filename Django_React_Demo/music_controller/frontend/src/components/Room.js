import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    loading: true, // New loading state
    song: {}
  });

  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once


  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
      setState((prevState) => ({
        ...prevState,
        spotifyAuthenticated: data.status
      }));
      if (!data.status) {
        fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) =>
        {
          window.location.replace(data.url);
        });
      }
    });
  };

  const getRoomDetails = async () => {
    try {
      const response = await fetch("/api/get-room?code=" + roomCode);
      if (!response.ok) {
        leaveRoomCallback();
        navigate("/");
        return;
      }
      const data = await response.json();
      setState((prevState) => ({
        ...prevState,
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
        loading: false, // Set loading to false when data is loaded
      }));
    } catch (error) {
      console.error("Error fetching room details:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false, // Set loading to false even if there's an error
      }));
    }
  };

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
      .then((response) => {
        if (!response.ok) {
          console.log("not okay");
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          song: data,
        }));
        console.log(data);
      });
  };
  
  useEffect(() => {
    if (state.isHost) {
      authenticateSpotify();
    }
  }, [state.isHost]);

  useEffect(() => {
    getRoomDetails(); // Call getRoomDetails on mount
    getCurrentSong();
  }, [roomCode, leaveRoomCallback, navigate]);

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      leaveRoomCallback();
      navigate("/");
    });
  };

  const updateShowSettings = (value) => {
    setState((prevState) => ({
      ...prevState,
      showSettings: value,
    }));
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={state.votesToSkip}
            guestCanPause={state.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  if (state.showSettings) {
    return renderSettings();
  }

  if (state.loading) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Loading...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer {...state.song} align="center"/>
      {state.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
