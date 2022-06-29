import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardActions,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../api/userApi";
import { PageHeader, CustomDialog, UserVaccine } from "../components";
import addressList from "../assets/dvhcvn.json";
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
import tdLogo from "../assets/images/TD.png";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [onDelete, setOnDelete] = useState(false);

  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await useApi.getOne(id);
        console.log(res);
        setUser(res);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  const onUpdateSuccess = () => {
    console.log("success");
    setDialogText("Update User  Success !");
    setDialogOpen(true);
    setDialogType("success");
  };

  const onUpdateFalse = (message) => {
    console.log("fail");
    setDialogText(message || "User Update Faile :<");
    setDialogOpen(true);
    setDialogType("error");
  };

  const deleteUser = async () => {
    if (onDelete) return;
    setOnDelete(true);
    try {
      await useApi.delete(id);
      setOnDelete(false);
      navigate("/user");
    } catch (err) {
      console.log(err);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qrcode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log("pngUrl", pngUrl);
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-down.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <PageHeader
        title="Thông Tin Chi Tiết"
        rightContent={
          <LoadingButton
            variant="contained"
            disableElevation
            color="error"
            loading={onDelete}
            onClick={deleteUser}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Xóa
          </LoadingButton>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Stack spacing={4}>
            {user && (
              <UserInfo
                user={user}
                onUpdateSuccess={onUpdateSuccess}
                onUpdateFalse={onUpdateFalse}
              />
            )}
            {user && <UserVaccine user={user} />}
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Card elevation={0}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {user && (
                  <QRCode
                    id="qrcode"
                    value={user.id}
                    size={300}
                    level="H"
                    includeMargin={true}
                    // crossorigin="anonymous"
                    imageSettings={{
                      src: `${tdLogo}`,
                      excavate: true,
                      height: 60,
                      width: 90,
                    }}
                    renderAs="canvas"
                  />
                )}
              </Box>
              <br />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={downloadQR}
                  startIcon={<ArrowCircleDownOutlinedIcon />}
                >
                  {" "}
                  Tải Xuống QR{" "}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <CustomDialog
        open={dialogOpen}
        type={dialogType}
        showIcon
        content={
          <Typography variant="subtitle1" textAlign="center">
            {dialogText}
          </Typography>
        }
        actions={
          <Box width="100%" sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              Ok
            </Button>
          </Box>
        }
      />
    </>
  );
};

export default UserDetail;

const UserInfo = ({ user, onUpdateFalse, onUpdateSuccess }) => {
  const [onUpdate, setOnUpdate] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [nameErr, setNameErr] = useState(false);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [phoneErr, setPhoneErr] = useState(false);
  // const [address, setAddress] = useState(
  //   addressList.data.find((e) => e.name === user.address || undefined)
  // );
  const [address, setAddress] = useState(user.address);
  const [addressErr, setAddressErr] = useState(false);
  const [idCard, setIdCard] = useState(user.idNumber);
  const [idCardErr, setIdCardErr] = useState(false);

  const updateUser = async () => {
    if (onUpdate) return;
    const err = [!phone, !name, !address, !idCard];
    setIdCardErr(!idCard);
    setPhoneErr(!phone);
    setNameErr(!name);
    setAddressErr(!address);
    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;

    setOnUpdate(true);

    const params = {
      phoneNumber: phone,
      fullName: name,
      idNumber: idCard,
      address: address,
    };

    try {
      const res = await useApi.update(user.id, params);
      console.log(res);
      setOnUpdate(false);
      onUpdateSuccess();
    } catch (err) {
      setOnUpdate(false);
      onUpdateFalse(err.response.data);
      console.log(err.response);
    }
  };
  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Giới Tính"
                variant="outlined"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                error={idCardErr}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Tên Đầy Đủ"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameErr}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Số Điện Thoại"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phoneErr}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Địa Chỉ"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={addressErr}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          disableElevation
          onClick={updateUser}
          loading={onUpdate}
        >
          Cập Nhật
        </LoadingButton>
      </CardActions>
    </Card>
  );
};
