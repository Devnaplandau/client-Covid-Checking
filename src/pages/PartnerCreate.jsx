import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  // FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomDialog, PageHeader } from "../components";
import partnerApi from "../api/partnerApi";

const PartnerCreate = () => {
  const navigate = useNavigate();
  const [onSubmit, setonSubmit] = useState(false);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  // phân quyền
  const [permissionUser, setPermissionUser] = useState(false);
  const [permissionPlace, setPermissionPlace] = useState(false);
  const [permissionInfoVaccine, setPermissionInfoVaccine] = useState(false);
  const [permissionDeclaration, setPermissionDeclaration] = useState(false);
  const [permissionScan, setPermissionScan] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");

  const createPartner = async () => {
    console.log("create partner");
    if (onSubmit) return;
    const err = [!name, !password];
    setNameErr(!name);
    setPasswordErr(!password);
    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;

    setonSubmit(true);

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
    // setonSubmit(false);
    try {
      const res = await partnerApi.create(params);
      console.log(res);
      setonSubmit(false);
      navigate(`/partner/admin`);
    } catch (err) {
      setonSubmit(false);
      setDialogText(err.response.data);
      setDialogOpen(true);
      setDialogType("error");
      console.log(err);
    }
  };
  const handleNamePartner = (value) => {
    setName(value);
  };
  const handlePassword = (value) => {
    setPassword(value);
  };

  const handlePermissionUser = (value) => {
    if (value == null && value == undefined) {
      setPermissionUser(false);
    }
    let e = value.target.checked;
    setPermissionUser(e);
  };
  const handlePermissionPlace = (value) => {
    if (value == null && value == undefined) {
      setPermissionPlace(false);
    }
    setPermissionPlace(value.target.checked);
  };
  const handlePermissionInfoVaccine = (value) => {
    if (value == null && value == undefined) {
      setPermissionInfoVaccine(false);
    }
    let b = value.target.checked;
    setPermissionInfoVaccine(b);
  };
  const handlePermissionDeclaration = (value) => {
    if (value == null && value == undefined) {
      setPermissionDeclaration(false);
    }
    let c = value.target.checked;
    setPermissionDeclaration(c);
  };
  const handlePermissionScan = (value) => {
    if (value == null && value == undefined) {
      setPermissionScan(false);
    }
    let d = value.target.checked;
    setPermissionScan(d);
  };

  return (
    <>
      <Box width="60%">
        <PageHeader
          title="Tạo Mới Đối Tác"
          rightContent={
            <Stack direction="row" spacing={2}>
              <Button variant="text" onClick={() => navigate(`/partner/admin`)}>
                Hủy
              </Button>
              <LoadingButton
                variant="contained"
                onClick={createPartner}
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
                    label="Tên Đầy Đủ"
                    variant="outlined"
                    value={name}
                    onChange={(e) => handleNamePartner(e.target.value)}
                    error={nameErr}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Mật Khẩu"
                    variant="outlined"
                    value={password}
                    onChange={(e) => handlePassword(e.target.value)}
                    error={passwordErr}
                  />
                </FormControl>
                {/* RADIO */}
                <FormControl>
                  <FormLabel
                    sx={{
                      // width: "200px",
                      mt: 2,
                      // mb: 2,
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
                      value={permissionUser}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Thông Tin Người Dùng"
                      onChange={(e) => handlePermissionUser(e)}
                    />
                    <FormControlLabel
                      value={permissionPlace}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Địa Điểm"
                      onChange={(e) => handlePermissionPlace(e)}
                    />
                    <FormControlLabel
                      value={permissionInfoVaccine}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Thông Tin Vaccine"
                      onChange={(e) => handlePermissionInfoVaccine(e)}
                    />
                    <FormControlLabel
                      value={permissionDeclaration}
                      control={<Checkbox />}
                      label="Quyền Truy Cập Truy Vết Khai Báo"
                      onChange={(e) => handlePermissionDeclaration(e)}
                    />
                    <FormControlLabel
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

export default PartnerCreate;
