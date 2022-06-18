import { useEffect, useState } from "react";
import { isAuthenticated } from "../handlers/authHandler";
import { Outlet, useNavigate } from "react-router-dom";
import { Loading, SideBar, TopNav } from "../components";
import { Box, colors, Toolbar } from "@mui/material";

const AppLayout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const res = await isAuthenticated();
      if (!res) return navigate("/login");
      setIsLoading(false);
    };
    checkToken();
  }, []);

  return isLoading ? (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Loading />
    </Box>
  ) : (
    <Box>
      {/* Top nav  */}
      <TopNav />
      <Box sx={{ display: "flex" }}>
        {/* sidebar here */}
        <SideBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: colors.grey["100"],
            width: "max-content",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
