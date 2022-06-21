import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { logout } from "../handlers/authHandler";
import bgImage from "../assets/images/logo.png";
import partnerImg from "../assets/images/partner.png";
import { useEffect, useState } from "react";
import partnerApi from "../api/partnerApi";
import { isAuthenticated } from "../handlers/authHandler";
import {
  AppBar,
  Avatar,
  colors,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
const TopNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const namePartner = localStorage.getItem("namePartner");

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: colors.common.white,
        color: colors.common.black,
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: "0px 1px 4px 1px rgb(0 0 0 / 12%)",
      }}
      elevation={0}
    >
      <Toolbar>
        <CoronavirusOutlinedIcon
          sx={{
            color: colors.red["800"],
            marginRight: "10px",
          }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cổng Thông Tin & Kiểm Tra Covid
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            alt="User image"
            src={localStorage.getItem("token") ? bgImage : partnerImg}
            sx={{
              height: "40px",
              width: "50px",
            }}
          />
          <Typography variant="h6">
            {localStorage.getItem("token")
              ? "Xin Chào Admin !"
              : `Xin Chào ${namePartner} !`}
          </Typography>
          <IconButton
            aria-label="logout"
            sx={{ color: colors.blue["800"] }}
            onClick={() => logout(navigate)}
          >
            <ExitToAppOutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
