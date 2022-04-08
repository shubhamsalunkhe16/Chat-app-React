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
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  let navigate = useNavigate();

  const handleLogin = () => {
    console.log("user", user, password);

    axios
      .post("http://10.100.0.59:8000/login", {
        username: user,
        password: password,
      })
      .then((res) => {
        console.log("login res", res);

        if (res.data.port === "NO PORT") {
          setErrorMsg("User not exist in the chain...Please try again");
        } else {
          navigate(`/chat/${user}`, {
            state: { port: res.data.port },
          });
          axios
            .get(`http://10.100.0.59:${res.data.port}/replace_user_chain`)
            .then((res) => {
              console.log("replace_user_chain", res.data);
            });
        }
      });
  };

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Login
      </Typography>

      {errorMsg && (
        <Typography
          sx={{ mt: 0, mb: 3, color: "red" }}
          variant="h6"
          component="div"
        >
          {errorMsg}
        </Typography>
      )}
      <TextField
        sx={{ mb: 2 }}
        id="outlined-basic"
        label="Username *"
        variant="outlined"
        value={user}
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <TextField
        id="outlined-basic"
        label="password *"
        variant="outlined"
        value={password}
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
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
        sx={{ backgroundColor: "teal", mt: "15px" }}
        variant="contained"
        onClick={() => {
          navigate(`/register`);
        }}
      >
        Go to Register Page
      </Button>
    </>
  );
}

export default Login;
