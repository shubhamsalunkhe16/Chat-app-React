import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography, TextField, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [user, setUser] = React.useState("");
  let navigate = useNavigate();

  const handleRegister = () => {
    axios
      .post("http://10.100.0.59:8000/add_user", {
        username: user,
      })
      .then((res) => {
        console.log("res", res, res.data.port);
        navigate(`/`);
      });
  };

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Register
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
          handleRegister();
        }}
      >
        Register
      </Button>
    </>
  );
}

export default Register;
