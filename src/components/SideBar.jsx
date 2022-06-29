import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import partnerApi from "../api/partnerApi";

import {
  colors,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

const SideBar = () => {
  const location = useLocation();
  const sideBarWidth = 300;
  const [activeIndex, setActiveIndex] = useState(0);
  const [partner, setPartner] = useState(localStorage.getItem("idPartner"));

  useEffect(() => {
    const getPartner = async () => {
      try {
        const res = await partnerApi.getOne(partner);
        setPartner(res);
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    getPartner();
  }, []);

  useEffect(() => {
    const activeItem = sideBarItems.findIndex(
      (item) =>
        window.location.pathname.split("/")[1] === item.path.split("/")[1]
    );
    setActiveIndex(activeItem);
  }, [location]);

  const sideBarItems = [
    {
      text: "Trang Chủ",
      path: "/",
      icon: <GridViewOutlinedIcon />,
      display: true,
    },
    {
      text: "Người Dùng",
      path: "/user",
      icon: <PersonOutlineOutlinedIcon />,
      display: localStorage.getItem("token") ? true : partner.permissionUser,
    },
    {
      text: "Địa Điểm",
      path: "/placeroom",
      icon: <PlaceOutlinedIcon />,
      display: localStorage.getItem("token") ? true : partner.permissionPlace,
    },
    {
      text: "Thông Tin Vaccine",
      path: "/vaccine",
      icon: <HealthAndSafetyOutlinedIcon />,
      display: localStorage.getItem("token")
        ? true
        : partner.permissionInfoVaccine,
    },
    {
      text: "Truy Vết Khai Báo",
      path: "/check",
      icon: <PersonSearchOutlinedIcon />,
      display: localStorage.getItem("token")
        ? true
        : partner.permissionDeclaration,
    },
    {
      text: "Quét Mã Nhanh",
      path: "/qr-scan",
      icon: <QrCodeScannerOutlinedIcon />,
      display: localStorage.getItem("token") ? true : partner.permissionScan,
    },
    {
      text: "Ý Kiến & Đánh Giá",
      path: "/feedback",
      icon: <CommentOutlinedIcon />,
      display: true,
    },
    {
      text: "Đối Tác",
      path: "/partner/admin",
      icon: <AccessibilityNewIcon />,
      display: localStorage.getItem("token") ? true : false,
    },
  ];

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      sx={{
        width: sideBarWidth,
        height: "100vh",
        boxShadow: "0px 1px 4px 1px rgb(0 0 0 / 12%)",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: sideBarWidth,
          borderRight: 0,
        },
      }}
      open={true}
    >
      <Toolbar />
      <List>
        {sideBarItems.map((item, index) => (
          <ListItemButton
            key={`siderbar-key-${index}`}
            selected={index === activeIndex}
            component={Link}
            to={item.path}
            sx={{
              width: "calc(100% - 20px)",
              margin: "5px auto",
              borderRadius: "20px",
              "&.Mui-selected": {
                color: colors.blue["A700"],
              },
              "&.Mui-selected:hover": {
                backgroundColor: colors.blue["200"],
              },
              display: item.display ? "flex" : "none",
            }}
          >
            <ListItemIcon
              sx={{
                color: index === activeIndex && colors.blue["A700"],
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& span": {
                  fontWeight: index === activeIndex && "500",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
