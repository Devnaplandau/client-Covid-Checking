import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { isAuthenticated } from "../handlers/authHandler";
import bgImage from "../assets/images/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [loginErr, setLoginErr] = useState();
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const res = await isAuthenticated();
      if (res) return navigate("/");
    };
    checkToken();
  }, []);
  const loginSubmit = async () => {
    if (onSubmit) return;
    setLoginErr(undefined);
    const checkErr = {
      username: username.trim().length === 0,
      password: password.trim().length === 0,
    };

    setUsernameErr(checkErr.username);
    setPasswordErr(checkErr.password);

    if (checkErr.username || checkErr.password) return;

    const params = {
      username,
      password,
    };
    setOnSubmit(true);
    try {
      const res = await authApi.login(params);
      localStorage.setItem("token", res.token);
      setOnSubmit(false);
      navigate("/");
    } catch (error) {
      // console.log(error.response.data);
      if (error.response.status === 401) {
        setLoginErr(error.response.data);
      }
      setOnSubmit(false);
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "pink",
        backgroundImage: `url(https://www.wbcsd.org/var/site/storage/images/overview/news-insights/wbcsd-insights/how-covid-19-is-reshaping-our-cities/145392-1-eng-GB/How-COVID-19-is-reshaping-our-cities_i1140.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: "600px" }}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            maxWidth: "400px",
            "& .MuiTextField-root": { mb: 5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            margin: "auto",
            padding: "5rem 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 400,
              minWidth: 300,
            }}
          >
            <Grid container justifyContent="center" mb={4}>
              <img
                src="https://tdu.edu.vn/storage/photos/2/TAY%20DO%20LOGO.png"
                width={200}
                alt="logo"
              />
            </Grid>
            <Typography
              variant="h5"
              textAlign="center"
              mb="1rem"
              fontWeight="700"
            >
              TDU - VACCINE & COVID
            </Typography>
            <TextField
              margin="normal"
              label="Tên Đăng Nhập"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameErr}
            />
            <TextField
              margin="normal"
              label="Mật Khẩu"
              type="password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordErr}
            />
          </div>
          {loginErr && (
            <FormControl>
              <Typography color="error">{loginErr}</Typography>
            </FormControl>
          )}
          <LoadingButton
            variant="contained"
            size="large"
            sx={{ marginTop: "1rem" }}
            onClick={loginSubmit}
          >
            Đăng Nhập
          </LoadingButton>
          <Button></Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
