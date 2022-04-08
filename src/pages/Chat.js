import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import "./Chat.css";

import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
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
  // height: "calc(100vh - 50px)",
  height: "100%",
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
  const [usersArray, setUsersArray] = useState(["jay", "yash"]);
  const [filteredUsersArray, setFilteredUsersArray] = useState();
  const [message, setMessage] = useState("");
  const [messageArray, setMessageArray] = useState("");
  const [port, setPort] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [user, setUser] = useState("");
  const [sendBtnDisable, setSendBtnDisable] = useState(true);
  const [showChats, setShowChats] = useState(false);
  let params = useParams();
  const location = useLocation();

  useEffect(() => {
    var user = params.user;
    setLoggedInUser(user);
    setPort(location.state.port);

    // document.getElementById("meassgeContainer").scroll({
    //   bottom: 0,
    //   behavior: "smooth",
    // });

    axios.get("http://10.100.0.59:8000/get_users_chain").then((res) => {
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

    var intervalMsg = setInterval(() => {
      // document.getElementById("meassgeContainer").scroll({
      //   bottom: 0,
      //   behavior: "smooth",
      // });

      axios
        .get(`http://10.100.0.59:${location.state.port}/get_chain`)
        .then((res) => {
          var msgArray = res.data.chain.map((data, i) => {
            return data?.transactions[0];
          });
          setMessageArray(msgArray);
        });
      axios
        .get(`http://10.100.0.59:${location.state.port}/replace_chain`)
        .then((res) => {
          console.log("replace_chain**");
        });
    }, 5000);

    axios
      .get(`http://10.100.0.59:${location.state.port}/replace_chain`)
      .then((res) => {
        console.log("replace_chain", res.data);
      });

    return () => clearInterval(intervalMsg);
  }, []);

  const handleSetUser = (user) => {
    if (window.innerWidth < 900) setShowChats(true);
    setUser(user);
    // document.getElementById("meassgeContainer").scroll({
    //   bottom: 0,
    //   behavior: "smooth",
    // });

    axios.get(`http://10.100.0.59:${port}/get_chain`).then((res) => {
      var msgArray = res.data.chain.map((data, i) => {
        return data?.transactions[0];
      });
      setMessageArray(msgArray);
    });
    axios.get(`http://10.100.0.59:${port}/replace_chain`).then((res) => {
      console.log("replace_chain**");
    });
  };

  const sendMeassge = () => {
    // document.getElementById("meassgeContainer").scroll({
    //   bottom: 0,
    //   behavior: "smooth",
    // });

    axios
      .post(`http://10.100.0.59:${port}/add_msg `, {
        sender: loggedInUser,
        receiver: user,
        msg: `${formatAMPM(new Date())}>>>${message}`,
      })
      .then((res) => {
        axios.get(`http://10.100.0.59:${port}/replace_chain`).then((res) => {
          console.log("replace_chain**");
        });
        axios.get(`http://10.100.0.59:${port}/get_chain`).then((res) => {
          var msgArray = res.data.chain.map((data, i) => {
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

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  return (
    <Grid
      container
      spacing={0}
      sx={{
        width: "100%",
        margin: "0 auto",
        overflow: "hidden",
        height: "90vh",
      }}
    >
      {!showChats && (
        <Grid item xs={12} md={3}>
          <Item sx={{ backgroundColor: "white", boxShadow: "none", p: "0px" }}>
            <TextField
              sx={{ width: "94%", m: "10px 3%" }}
              placeholder="Search User"
              type="search"
              variant="outlined"
              onChange={(e) => {
                filterUser(e.target.value);
              }}
            />
            <Demo>
              <List>
                {filteredUsersArray?.map((filtereduser, i) => {
                  return (
                    <ListItem
                      key={filtereduser + i}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          filtereduser === user ? "#dddddd" : "e9e9e9",
                      }}
                      onClick={() => {
                        handleSetUser(filtereduser);
                      }}
                    >
                      <ListItemIcon>
                        <Avatar src="backupImage.png" alt={filtereduser} />
                      </ListItemIcon>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        sx={{ fontSize: "16px", mt: "5px" }}
                      >
                        {filtereduser}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Demo>
          </Item>
        </Grid>
      )}
      {(showChats || window.innerWidth > 900) && (
        <Grid
          item
          xs={12}
          md={9}
          // display={{ xs: "none", md: "block" }}
          sx={{ position: "relative" }}
        >
          <Item
            sx={{
              overflow: "auto",
              p: "0px",
              backgroundColor: "#edf5f9",
              boxShadow: "none",
            }}
          >
            <Item
              sx={{
                backgroundColor: "white",
                height: "60px",
                position: "absolute",
                top: "0px",
                width: "calc(100% - 16px)",
                zIndex: "10",
                // boxShadow: "none",
              }}
            >
              <ListItem>
                {window.innerWidth < 900 && (
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowChats(false);
                    }}
                  >
                    &#x2190; &nbsp;
                  </Typography>
                )}
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
                backgroundColor: "white",
                height: "calc(100% - 162px)",
                overflow: "auto",
                mt: "75px",
                pt: "10px",
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
                          <>
                            <ListItem
                              key={"meassges_" + data?.sender}
                              sx={{
                                backgroundColor: "#e9e9e9",
                                maxWidth: "70%",
                                width: "auto",
                                minWidth: "100px",
                                m: "0px 10px 10px 10px",
                                justifyContent: "flex-end",
                                float: "right",
                                borderRadius: "6px",
                                position: "relative",
                                clear: "both",
                              }}
                            >
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{
                                  pb: "10px",
                                  mr: "auto",
                                  fontSize: "16px",
                                }}
                              >
                                {data?.msg.split(">>>")[1]}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                                sx={{
                                  position: "absolute",
                                  right: "10px",
                                  bottom: "0px",
                                  color: "black",
                                }}
                              >
                                {data?.msg.split(">>>")[0]}
                              </Typography>
                            </ListItem>
                          </>
                        ) : (
                          <ListItem
                            key={"meassges_" + data?.receiver}
                            sx={{
                              backgroundColor: "#e9e9e9",
                              maxWidth: "70%",
                              minWidth: "100px",
                              width: "auto",
                              m: "0px 10px 10px 10px",
                              justifyContent: "flex-start",
                              float: "left",
                              borderRadius: "6px",
                              position: "relative",
                              clear: "both",
                            }}
                          >
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                              sx={{ pb: "10px", fontSize: "16px" }}
                            >
                              {data?.msg.split(">>>")[1]}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                              sx={{
                                position: "absolute",
                                right: "10px",
                                bottom: "0px",
                                color: "black",
                              }}
                            >
                              {data?.msg.split(">>>")[0]}
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
                // backgroundColor: "#e9e9e9",
                // boxShadow:
                // "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                height: "60px",
                position: "absolute",
                bottom: "0px",
                width: "calc(100% - 16px)",
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
                  fontSize: "16px",
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
      )}
    </Grid>
  );
}

export default Chat;
