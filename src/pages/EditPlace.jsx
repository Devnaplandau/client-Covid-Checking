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
import placeApi from "../api/placeApi";
import { PageHeader, CustomDialog } from "../components";
import { Link } from "react-router-dom";

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [placeCheck, setPlaceCheck] = useState();

  useEffect(() => {
    const getPlace = async () => {
      try {
        const res = await placeApi.getOne(id);
        setPlaceCheck(res);
      } catch (error) {
        console.log(error);
      }
    };
    getPlace();
  }, []);
  const onUpdateSuccess = () => {
    console.log("success");
    setDialogText("Update Place Success !");
    setDialogOpen(true);
    setDialogType("success");
    // navigate("/placeroom");
  };

  const onUpdateFalse = (message) => {
    console.log("fail");
    setDialogText(message || "Place Update Faile :<");
    setDialogOpen(true);
    setDialogType("error");
  };

  return (
    <>
      <PageHeader title="Cập Nhật Địa Điểm" />
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Stack spacing={4}>
            {placeCheck && (
              <PlaceInfo
                place={placeCheck}
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
            <Button
              variant="contained"
              onClick={() => setDialogOpen(false)}
              component={Link}
              to={"/placeroom"}
            >
              Ok
            </Button>
          </Box>
        }
      />
    </>
  );
};

export default EditPlace;

const PlaceInfo = ({ place, onUpdateFalse, onUpdateSuccess }) => {
  // console.log(place);
  const [onUpdate, setOnUpdate] = useState(false);
  const [nameAddress, setNameAddress] = useState(place.name);
  const [nameAddressErr, setNameAddressErr] = useState(false);
  const [area, setArea] = useState(place.address);
  const [areaErr, setAreaErr] = useState(false);

  const updatePlace = async () => {
    if (onUpdate) return;
    const err = [!nameAddress, !area];
    setNameAddressErr(!nameAddress);
    setAreaErr(!area);
    // console.log(!err.every((e) => typeof e));
    if (!err.every((e) => !e)) return;
    setOnUpdate(true);

    const params = {
      name: nameAddress,
      address: area,
    };

    try {
      const res = await placeApi.update(place.id, params);
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
                label="Tên Địa Điểm"
                variant="outlined"
                value={nameAddress}
                onChange={(e) => setNameAddress(e.target.value)}
                error={nameAddressErr}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Khu Vực"
                variant="outlined"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                error={areaErr}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          disableElevation
          onClick={updatePlace}
          loading={onUpdate}
        >
          Update
        </LoadingButton>
      </CardActions>
    </Card>
  );
};
