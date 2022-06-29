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
import { IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import moment from "moment";
import { PageHeader } from "../components";
import { LoadingButton } from "@mui/lab";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { useNavigate } from "react-router-dom";
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
      setOnLoad(false);
      navigate("/feedback");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (id) => {
    try {
      await feedBackApi.delete(id);
      const res = await feedBackApi.getAll();
      setFeedBack(res);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(feedBack);
  return (
    <>
      <PageHeader
        title="Tổng Hợp Ý Kiến và Đánh Giá"
        rightContent={
          <LoadingButton
            variant="contained"
            disableElevation
            color="info"
            loading={onLoad}
            onClick={loadComment}
            startIcon={<RestartAltOutlinedIcon />}
          >
            Làm Mới
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
                      {`Khu Vực: ${item.namePlace}`}
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
                      {`Thời gian: ${moment(item.createdAt).format(
                        "DD/MM/YYYY - HH:mm:ss"
                      )}`}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItem
                secondaryAction={
                  <IconButton
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
            </ListItem>
            <Divider variant="inset" />
          </List>
        ))}
    </>
  );
};

export default FeedBack;
