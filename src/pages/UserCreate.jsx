import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomDialog, PageHeader } from "../components";
import addressList from "../assets/dvhcvn.json";
import useApi from "../api/userApi";
import { display } from "@mui/system";

const UserCreate = () => {
  const navigate = useNavigate();
  const [onSubmit, setonSubmit] = useState(false);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState(false);
  const [address, setAddress] = useState();
  const [addressErr, setAddressErr] = useState(false);
  const [idCard, setIdCard] = useState("");
  const [idCardErr, setIdCardErr] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");

  //  chú ý cho nhuật ngày mai
  const [alert, setAlert] = useState(false);
  const [dateCheck, setDateCheck] = useState("");

  const createUser = async () => {
    console.log("create user");
    if (onSubmit) return;

    const err = [!phone, !name, !address, !idCard];
    setIdCardErr(!idCard);
    setPhoneErr(!phone);
    setNameErr(!name);
    setAddressErr(!address);
    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;

    setonSubmit(true);

    const params = {
      phoneNumber: phone,
      fullName: name,
      idNumber: idCard,
      address: address.name,
      alert: alert,
      dateCheck: dateCheck,
    };

    try {
      const res = await useApi.create(params);
      console.log(res);
      setonSubmit(false);
      navigate(`/user`);
    } catch (err) {
      setonSubmit(false);
      setDialogText(err.response.data);
      setDialogOpen(true);
      setDialogType("error");
      console.log(err);
    }
  };
  return (
    <>
      <Box width="40%">
        <PageHeader
          title="Tạo Mới Người Dùng"
          rightContent={
            <Stack direction="row" spacing={2}>
              <Button variant="text" onClick={() => navigate("/user")}>
                Hủy
              </Button>
              <LoadingButton
                variant="contained"
                onClick={createUser}
                loading={onSubmit}
              >
                Tạo
              </LoadingButton>
            </Stack>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card elevation={1}>
              <CardContent>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Giới Tính"
                    variant="outlined"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    error={idCardErr}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Tên Đầy Đủ"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameErr}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Số Điện Thoại"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={phoneErr}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                    options={addressList.data}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <Box {...props} component="li">
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Địa Chỉ"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                        error={addressErr}
                      />
                    )}
                    value={address}
                    onChange={(event, newValue) => setAddress(newValue)}
                  />
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
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

export default UserCreate;
