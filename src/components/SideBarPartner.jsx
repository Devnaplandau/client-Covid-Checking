import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

import {
  colors,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

const SideBarPartner = () => {
  const location = useLocation();
  const sideBarWidth = 300;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const activeItem = sideBarItems.findIndex(
      (item) =>
        window.location.pathname.split("/partner")[1] ===
        item.path.split("/partner")[1]
    );
    setActiveIndex(activeItem);
  }, [location]);

  const sideBarItems = [
    {
      display: true,
      text: "Trang Chủ",
      path: "/partner",
      icon: <GridViewOutlinedIcon />,
    },
    {
      text: "Người Dùng",
      path: "/partner/user",
      icon: <PersonOutlineOutlinedIcon />,
      display: true,
    },
    {
      text: "Địa Điểm",
      path: "/partner/placeroom",
      icon: <PlaceOutlinedIcon />,
      display: true,
    },
    {
      text: "Thông Tin Vaccine",
      path: "/partner/vaccine",
      icon: <HealthAndSafetyOutlinedIcon />,
      display: true,
    },
    {
      text: "Truy Vết Khai Báo",
      path: "/partner/check",
      icon: <PersonSearchOutlinedIcon />,
      display: true,
    },
    {
      text: "Quét Mã Nhanh",
      path: "/partner/qr-scan",
      icon: <QrCodeScannerOutlinedIcon />,
      display: true,
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

export default SideBarPartner;
