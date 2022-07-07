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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PageHeader, CustomDialog } from "../components";
import partnerApi from "../api/partnerApi";
// import QRCode from "react-qr-code";

const PartnerEdit = () => {
  const { id } = useParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");

  const [partner, setPartner] = useState();
  useEffect(() => {
    const getPartner = async () => {
      try {
        const res = await partnerApi.getOne(id);
        setPartner(res);
      } catch (error) {
        console.log(error);
      }
    };
    getPartner();
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

  return (
    <>
      <PageHeader
        title="Thông Tin Chi Tiết Đối Tác"
        // rightContent={
        //   <LoadingButton
        //     variant="contained"
        //     disableElevation
        //     color="error"
        //     loading={onDelete}
        //     startIcon={<DeleteOutlineOutlinedIcon />}
        //   >
        //     Xóa
        //   </LoadingButton>
        // }
      />
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Stack spacing={4}>
            {partner && (
              <PartnerInfo
                partner={partner}
                onUpdateSuccess={onUpdateSuccess}
                onUpdateFalse={onUpdateFalse}
              />
            )}
          </Stack>
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

export default PartnerEdit;

const PartnerInfo = ({ partner, onUpdateFalse, onUpdateSuccess }) => {
  console.log(partner);
  const navigate = useNavigate();
  const [onUpdate, setOnUpdate] = useState(false);

  const [name, setName] = useState(partner.fullName);
  const [nameErr, setNameErr] = useState(false);
  const [password, setPassword] = useState(partner.password);
  const [passwordErr, setPasswordErr] = useState(false);
  // phân quyền
  const [permissionUser, setPermissionUser] = useState(partner.permissionUser);
  const [permissionPlace, setPermissionPlace] = useState(
    partner.permissionPlace
  );
  const [permissionInfoVaccine, setPermissionInfoVaccine] = useState(
    partner.permissionInfoVaccine
  );
  const [permissionDeclaration, setPermissionDeclaration] = useState(
    partner.permissionDeclaration
  );
  const [permissionScan, setPermissionScan] = useState(partner.permissionScan);
  // handle check lại để cập nhật

  // -----------------------
  const updateUser = async () => {
    if (onUpdate) return;
    const err = [!name, !password];
    setNameErr(!name);
    setPasswordErr(!password);
    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;

    setOnUpdate(true);

    const params = {
      fullName: name,
      password: password,
      permissionUser: permissionUser,
      permissionPlace: permissionPlace,
      permissionInfoVaccine: permissionInfoVaccine,
      permissionDeclaration: permissionDeclaration,
      permissionScan: permissionScan,
    };
    // console.log(params);
    // setOnUpdate(false);
    try {
      const res = await partnerApi.update(partner.id, params);
      console.log(res);
      setOnUpdate(false);
      onUpdateSuccess();
    } catch (err) {
      setOnUpdate(false);
      onUpdateFalse(err.response.data);
      console.log(err.response);
    }
    navigate(`/partner/admin`);
  };

  const handlePermissionUser = (value) => {
    setPermissionUser(value.target.checked);
  };
  const handlePermissionPlace = (value) => {
    setPermissionPlace(value.target.checked);
  };
  const handlePermissionInfoVaccine = (value) => {
    setPermissionInfoVaccine(value.target.checked);
  };
  const handlePermissionDeclaration = (value) => {
    setPermissionDeclaration(value.target.checked);
  };
  const handlePermissionScan = (value) => {
    setPermissionScan(value.target.checked);
  };

  return (
    <>
      <Box width="80%">
        <PageHeader
          // title="Tạo Mới Đối Tác"
          rightContent={
            <Stack direction="row" spacing={2}>
              <Button variant="text" onClick={() => navigate(`/partner/admin`)}>
                Hủy
              </Button>
              <LoadingButton
                variant="contained"
                disableElevation
                onClick={updateUser}
                loading={onUpdate}
              >
                Cập Nhật
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
                    label="Tên Đầy Đủ"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameErr}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Mật Khẩu"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordErr}
                  />
                </FormControl>
                {/* RADIO */}
                <FormControl>
                  <FormLabel
                    sx={{
                      mt: 2,
                      pt: 2,
                      pr: 2,
                      pb: 2,
                      fontSize: 20,
                      fontWeight: "bold",
                      // boxShadow: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                    id="demo-radio-buttons-group-label"
                  >
                    Cấp Quyền Cho Đối Tác
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    // defaultValue=""
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      checked={permissionUser}
                      value={permissionUser}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Thông Tin Người Dùng"
                      onChange={(e) => handlePermissionUser(e)}
                    />
                    <FormControlLabel
                      checked={permissionPlace}
                      value={permissionPlace}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Địa Điểm"
                      onChange={(e) => handlePermissionPlace(e)}
                    />
                    <FormControlLabel
                      checked={permissionInfoVaccine}
                      value={permissionInfoVaccine}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Thông Tin Vaccine"
                      onChange={(e) => handlePermissionInfoVaccine(e)}
                    />
                    <FormControlLabel
                      checked={permissionDeclaration}
                      value={permissionDeclaration}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Truy Vết Khai Báo"
                      onChange={(e) => handlePermissionDeclaration(e)}
                    />
                    <FormControlLabel
                      checked={permissionScan}
                      value={permissionScan}
                      control={<Checkbox />}
                      label="Quyền Quét Mã Nhanh"
                      onChange={(e) => handlePermissionScan(e)}
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
