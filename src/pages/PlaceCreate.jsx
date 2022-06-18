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
import placeApi from "../api/placeApi";

const PlaceCreate = () => {
  const navigate = useNavigate();
  const [onSubmit, setonSubmit] = useState(false);
  const [nameAddress, setNameAddress] = useState("");
  const [nameAddressErrr, setNameAddressErrr] = useState(false);
  const [Area, setArea] = useState("");
  const [AreaErr, SetAreaErr] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");

  const createPlace = async () => {
    console.log("create user");
    if (onSubmit) return;

    const err = [!nameAddress, !Area];
    setNameAddressErrr(!nameAddress);
    SetAreaErr(!Area);

    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;

    setonSubmit(true);

    const params = {
      name: nameAddress,
      address: Area,
    };

    try {
      const res = await placeApi.create(params);
      console.log(res);
      setonSubmit(false);
      navigate(`/placeroom`);
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
          title="Tạo Địa Điểm"
          rightContent={
            <Stack direction="row" spacing={2}>
              <Button variant="text" onClick={() => navigate("/placeroom")}>
                Hủy
              </Button>
              <LoadingButton
                variant="contained"
                onClick={createPlace}
                loading={onSubmit}
              >
                Tạo Mới
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
                    label="Tên Địa Điểm"
                    variant="outlined"
                    value={nameAddress}
                    onChange={(e) => setNameAddress(e.target.value)}
                    error={nameAddressErrr}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Khu Vực"
                    variant="outlined"
                    value={Area}
                    onChange={(e) => setArea(e.target.value)}
                    error={AreaErr}
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

export default PlaceCreate;
