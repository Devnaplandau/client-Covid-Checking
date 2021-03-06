import * as React from "react";
import { useEffect, useState } from "react";
import feedBackApi from "../api/feedBackApi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import profile from "../assets/images/profile.png";
import { FormControlLabel, Checkbox, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import moment from "moment";
import { PageHeader } from "../components";
import { LoadingButton } from "@mui/lab";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const FeedBack = () => {
  const navigate = useNavigate();
  const [feedBack, setFeedBack] = useState([]);
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    const getFeedBacks = async () => {
      try {
        const res = await feedBackApi.getAll();
        setFeedBack(res);
      } catch (err) {
        console.log(err);
      }
    };
    getFeedBacks();
  }, []);

  const loadComment = async () => {
    if (onLoad) return;
    setOnLoad(true);
    try {
      const res = await feedBackApi.getAll();
      setFeedBack(res);
      console.log(res);
      setOnLoad(false);
      navigate("/feedback");
    } catch (err) {
      console.log(err);
    }
  };
  const handleCheck = async (e, id, token) => {
    // console.log(id);
    // console.log(e.target.checked);
    const params = {
      statusComment: e.target.checked,
    };
    try {
      await feedBackApi.update(id, params);
      // set notication status token
      if (e.target.checked == true) {
        await axios({
          method: "post",
          url: "https://fcm.googleapis.com/fcm/send",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "key=AAAAtlqzzoc:APA91bG74FOUVxIFPwYeWcVz225WmNzwYN_FtUq2jjIEMCtuD160ZkOIi9Bi3p_qjvsMg6q7ErRKkRxTZdni8_T1Ks4oxjib8cWDjdaVfJktdN0fw0cVVjMSaylYwWPNzBnu8mtrW6AW",
          },
          data: {
            notification: {
              title: "Th??ng b??o !",
              body: "Ph???n h???i c???a b???n ???? ???????c x??? l?? !",
            },
            to: `${token}`,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChecked = (value) => {
    if (value.statusComment == true) {
      return true;
    } else {
      return false;
    }
  };

  const deleteComment = async (id) => {
    // console.log(tokenUser);
    try {
      await feedBackApi.delete(id);
      const res = await feedBackApi.getAll();
      setFeedBack(res);

      // set notication delete
      // await axios({
      //   method: "post",
      //   url: "https://fcm.googleapis.com/fcm/send",
      //   headers: {
      //     "Content-Type": "application/json; charset=utf-8",
      //     Authorization:
      //       "key=AAAAtlqzzoc:APA91bG74FOUVxIFPwYeWcVz225WmNzwYN_FtUq2jjIEMCtuD160ZkOIi9Bi3p_qjvsMg6q7ErRKkRxTZdni8_T1Ks4oxjib8cWDjdaVfJktdN0fw0cVVjMSaylYwWPNzBnu8mtrW6AW",
      //   },
      //   data: {
      //     notification: {
      //       title: "Th??ng b??o !",
      //       body: "Ph???n h???i c???a b???n ???? ???????c x??? l?? !",
      //     },
      //     to: `${tokenUser}`,
      //   },
      // });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(feedBack);
  return (
    <>
      <PageHeader
        title="T???ng H???p Ph???n H???i V?? ?? Ki???n"
        rightContent={
          <LoadingButton
            variant="contained"
            disableElevation
            color="info"
            loading={onLoad}
            onClick={loadComment}
            startIcon={<RestartAltOutlinedIcon />}
          >
            L??m M???i
          </LoadingButton>
        }
      />
      {feedBack &&
        feedBack.map((item) => (
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {/* <Divider variant="inset" component="li" /> */}
            <ListItem
              key={item.id}
              alignItems="flex-start"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItemAvatar>
                <Avatar alt="An" src={profile} />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: 20,
                  fontWeight: "medium",
                  letterSpacing: 1,
                }}
                primary={item.user.fullName}
                secondary={
                  <React.Fragment
                    key={item.id}
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{ display: "inline", mt: 1 }}
                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {`Khu V???c: ${item.namePlace}`}
                    </Typography>
                    <Typography
                      sx={{
                        display: "block",
                        mt: 1,
                        // width: "800px",
                        minWidth: 400,
                      }}
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      color="text.primary"
                    >
                      {item.comment}
                    </Typography>
                    <Typography
                      sx={{ display: "block", mt: 1 }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {`Th???i gian: ${moment(item.createdAt).format(
                        "DD/MM/YYYY - HH:mm:ss"
                      )}`}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItem
                secondaryAction={
                  <IconButton
                    sx={{
                      display: `${
                        localStorage.getItem("tokenPartner") ? "none" : "block"
                      }`,
                    }}
                    edge="end"
                    aria-label="delete"
                    color="error"
                    size="medium"
                    onClick={() => deleteComment(item.id)}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                }
              ></ListItem>
              <FormControlLabel
                sx={{
                  width: "250px",
                }}
                control={<Checkbox defaultChecked={handleChecked(item)} />}
                label={item.statusComment ? "???? X??? L??" : "Ch??a X??? L??"}
                onChange={(e) => handleCheck(e, item.id, item.user.tokenUser)}
              />
            </ListItem>
            <Divider variant="inset" />
          </List>
        ))}
    </>
  );
};

export default FeedBack;
