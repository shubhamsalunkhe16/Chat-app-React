import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import "./Chat.css";

import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { TextField, Fab } from "@mui/material";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "calc(100vh - 50px)",
  backgroundColor: "#dddddd",
  position: "relative",
}));

const FabButton = styled(Fab)(({ theme }) => ({
  ":disabled": {
    backgroundColor: "#3dafea",
    opacity: "0.6",
  },
}));

function Chat() {
  const [usersArray, setUsersArray] = useState();
  const [filteredUsersArray, setFilteredUsersArray] = useState();
  const [message, setMessage] = useState("");
  const [messageArray, setMessageArray] = useState("");
  const [port, setPort] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [user, setUser] = useState("");
  const [sendBtnDisable, setSendBtnDisable] = useState(true);
  let params = useParams();
  const location = useLocation();

  useEffect(() => {
    var user = params.user;
    setLoggedInUser(user);
    setPort(location.state.port);

    document.getElementById("meassgeContainer").scroll({
      bottom: 0,
      behavior: "smooth",
    });

    axios.get("https://10.100.0.59:8000/get_users_chain").then((res) => {
      var usersArray = res.data.chain
        .filter((data) => {
          return data.users.length !== 0 && data.users[0].username !== user;
        })
        .map((data) => {
          return data.users[0].username;
        });
      setUsersArray(usersArray);
      setFilteredUsersArray(usersArray);
      setUser(usersArray[0]);
    });

    // axios
    //   .get(`https://10.100.0.59:${location.state.port}/get_chain`)
    //   .then((res) => {
    //     var msgArray = res.data.chain.map((data, i) => {
    //       console.log("msg", data?.transactions[0]);
    //       return data?.transactions[0];
    //     });
    //     setMessageArray(msgArray);
    //   });

    var intervalMsg = setInterval(() => {
      document.getElementById("meassgeContainer").scroll({
        bottom: 0,
        behavior: "smooth",
      });

      axios
        .get(`https://10.100.0.59:${location.state.port}/get_chain`)
        .then((res) => {
          var msgArray = res.data.chain.map((data, i) => {
            console.log("msg****", data?.transactions[0]);
            return data?.transactions[0];
          });
          setMessageArray(msgArray);
        });
      axios
        .get(`https://10.100.0.59:${location.state.port}/replace_chain`)
        .then((res) => {
          console.log("replace_chain**");
        });
    }, 5000);

    axios
      .get(`https://10.100.0.59:${location.state.port}/replace_chain`)
      .then((res) => {
        console.log("replace_chain", res.data);
      });

    return () => clearInterval(intervalMsg);
  }, []);

  const handleSetUser = (user) => {
    setUser(user);
    document.getElementById("meassgeContainer").scroll({
      bottom: 0,
      behavior: "smooth",
    });

    axios.get(`https://10.100.0.59:${port}/get_chain`).then((res) => {
      var msgArray = res.data.chain.map((data, i) => {
        console.log("msg****", data?.transactions[0]);
        return data?.transactions[0];
      });
      setMessageArray(msgArray);
    });
    axios.get(`https://10.100.0.59:${port}/replace_chain`).then((res) => {
      console.log("replace_chain**");
    });
  };

  const sendMeassge = () => {
    document.getElementById("meassgeContainer").scroll({
      bottom: 0,
      behavior: "smooth",
    });
    axios
      .post(`https://10.100.0.59:${port}/add_msg `, {
        sender: loggedInUser,
        receiver: user,
        msg: message,
      })
      .then((res) => {
        axios.get(`https://10.100.0.59:${port}/replace_chain`).then((res) => {
          console.log("replace_chain**");
        });
        axios.get(`https://10.100.0.59:${port}/get_chain`).then((res) => {
          var msgArray = res.data.chain.map((data, i) => {
            console.log("detch messages after send****", data?.transactions[0]);
            return data?.transactions[0];
          });
          setMessageArray(msgArray);
          setMessage("");
        });
      });
  };

  const filterUser = (name) => {
    if (name) {
      var filteredArray = usersArray.filter((user) => {
        return user.includes(name);
      });
      setFilteredUsersArray(filteredArray);
    } else {
      setFilteredUsersArray(usersArray);
    }
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{ width: "100%", margin: "0 auto", overflow: "hidden" }}
    >
      <Grid item xs={4}>
        <Item>
          <TextField
            sx={{ width: "95%" }}
            placeholder="Search User"
            type="search"
            variant="outlined"
            onChange={(e) => {
              filterUser(e.target.value);
            }}
          />
          <Demo>
            <List sx={{ backgroundColor: "#dddddd" }}>
              {filteredUsersArray?.map((user, i) => {
                return (
                  <ListItem
                    key={user + i}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      handleSetUser(user);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar src="backupImage.png" alt={user} />
                    </ListItemIcon>
                    <Typography variant="h6" gutterBottom component="div">
                      {user}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </Demo>
        </Item>
      </Grid>
      <Grid item xs={8} sx={{ position: "relative" }}>
        <Item sx={{ overflow: "auto", p: "0px", backgroundColor: "#edf5f9" }}>
          <Item
            sx={{
              backgroundColor: "#e27d5f",
              height: "60px",
              position: "fixed",
              top: "16px",
              width: "65%",
              zIndex: "10",
            }}
          >
            <ListItem>
              <ListItemIcon>
                <Avatar src="backupImage.png" alt={user} />
              </ListItemIcon>
              <Typography variant="h6" gutterBottom component="div">
                {user}
              </Typography>
            </ListItem>
          </Item>

          <Box
            id="meassgeContainer"
            sx={{
              // backgroundColor: "red",
              height: "calc(100% - 170px)",
              overflow: "auto",
              mt: "90px",
            }}
          >
            {messageArray.length !== 0 &&
              messageArray.map((data) => {
                return (
                  <>
                    {data?.msg !== undefined &&
                      (data?.receiver === loggedInUser ||
                        data?.receiver === user) &&
                      (data?.sender === loggedInUser ||
                        data?.sender === user) &&
                      (data?.sender === loggedInUser ? (
                        <ListItem
                          key={"meassges_" + data?.sender}
                          sx={{
                            backgroundColor: "#28bfbe",
                            width: "50%",
                            m: "0px 10px 10px 10px",
                            justifyContent: "flex-end",
                            float: "right",
                            borderRadius: "6px",
                          }}
                        >
                          <Typography variant="h6" gutterBottom component="div">
                            {data?.msg}
                          </Typography>
                        </ListItem>
                      ) : (
                        <ListItem
                          key={"meassges_" + data?.receiver}
                          sx={{
                            backgroundColor: "#d7e4f4",
                            width: "50%",
                            m: "0px 10px 10px 10px",
                            justifyContent: "flex-start",
                            float: "left",
                            borderRadius: "6px",
                          }}
                        >
                          <Typography variant="h6" gutterBottom component="div">
                            {data?.msg}
                          </Typography>
                        </ListItem>
                      ))}
                  </>
                );
              })}
          </Box>
          <Item
            sx={{
              backgroundColor: "white",
              height: "60px",
              position: "fixed",
              bottom: "30px",
              width: "65%",
              display: "flex",
            }}
          >
            <TextField
              value={message}
              onChange={(e) => {
                e.target.value !== ""
                  ? setSendBtnDisable(false)
                  : setSendBtnDisable(true);
                setMessage(e.target.value);
              }}
              placeholder="Send Message"
              sx={{
                flex: "1",
                backgroundColor: "#edf5f9",
              }}
            />
            <FabButton
              disabled={sendBtnDisable}
              aria-label="edit"
              sx={{
                ml: "10px",
                backgroundColor: "#3dafea",
              }}
              onClick={() => {
                sendMeassge();
              }}
            >
              <SendIcon />
            </FabButton>
            {/* </Box> */}
          </Item>
        </Item>
      </Grid>
    </Grid>
  );
}

export default Chat;
