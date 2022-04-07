import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography, Button, TextField } from "@mui/material";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [user, setUser] = React.useState("");
  let navigate = useNavigate();

  const handleLogin = () => {
    console.log("user", user);

    axios.get("https://10.100.0.59:8000/login/" + user).then((res) => {
      console.log("port", res, res.data.port);
      navigate(`/chat/${user}`, {
        state: { port: res.data.port },
      });
      axios
        .get(`https://10.100.0.59:${res.data.port}/replace_user_chain`)
        .then((res) => {
          console.log("replace_user_chain", res.data);
        });
    });
  };

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Login
      </Typography>
      <TextField
        id="outlined-basic"
        label="Username *"
        variant="outlined"
        value={user}
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <Button
        sx={{ backgroundColor: "#2abebe", mt: "15px" }}
        variant="contained"
        onClick={() => {
          handleLogin();
        }}
      >
        Login
      </Button>

      <Button
        sx={{ backgroundColor: "#2abebe", mt: "15px" }}
        variant="contained"
        onClick={() => {
          navigate(`/register`);
        }}
      >
        Register
      </Button>
    </>
  );
}

export default Login;
