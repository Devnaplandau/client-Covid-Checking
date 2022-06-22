import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import vaccineApi from "../api/vaccineApi";
import { CustomDialog, PageHeader, VaccineLots } from "../components";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const VaccineDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vaccine, setVaccine] = useState();
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [onDelete, setOnDelete] = useState(false);
  useEffect(() => {
    const getVaccine = async () => {
      try {
        const res = await vaccineApi.getOne(id);
        //  console.log(res);
        setVaccine(res);
        setName(res.name);
      } catch (err) {
        console.log(err);
      }
    };
    getVaccine();
  }, []);

  const updateVaccine = async () => {
    if (onSubmit) return;
    if (!name || name.trim().length === 0) {
      setNameErr(true);
      return;
    }
    setNameErr(false);
    setOnSubmit(true);

    try {
      const res = await vaccineApi.update(id, { name });
      console.log(res);
      setDialogText("Vaccine update");
      setDialogType("success");
    } catch (err) {
      console.log(err);
      setDialogText("Vaccine update fail");
      setDialogType("error");
    } finally {
      setOnSubmit(false);
      setDialogOpen(true);
    }
  };

  const deleteVaccine = async () => {
    if (onDelete) return;
    setOnDelete(true);
    try {
      await vaccineApi.delete(id);
      setOnDelete(false);
      navigate("/vaccine");
    } catch (err) {
      console.log(err);
      setDialogText("Delete fail");
      setDialogType("error");
      setDialogOpen(true);
    }
  };

  const resetPage = async () => {
    try {
      const res = await vaccineApi.getOne(id);
      setVaccine(res);
      setName(res.name);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <PageHeader
        title="Chi Tiết Vaccine"
        rightContent={
          <LoadingButton
            variant="contained"
            disableElevation
            color="error"
            loading={onDelete}
            onClick={deleteVaccine}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Xóa
          </LoadingButton>
        }
      />

      <Grid container spacing={0} marginTop={4}>
        <Stack spacing={2}>
          <Grid item xs={0}>
            <Card elevation={0}>
              <CardContent>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Tên Lô Vaccine"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameErr}
                  />
                </FormControl>
                {vaccine && (
                  <>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Số Lượng Có Sẵn"
                        variant="outlined"
                        value={vaccine.quantity - vaccine.vaccinated}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Tổng Số Lượng"
                        variant="outlined"
                        value={vaccine.quantity}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Vaccine Đã Tiêm"
                        variant="outlined"
                        value={vaccine.vaccinated}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                  </>
                )}
              </CardContent>
              <CardActions>
                <LoadingButton
                  variant="contained"
                  loading={onSubmit}
                  disableElevation
                  onClick={updateVaccine}
                >
                  Cập Nhật
                </LoadingButton>
              </CardActions>
            </Card>
          </Grid>
          {/* ------------------------------------------------ */}
          <Box
            sx={{
              width: 1140,
              maxWidth: "100%",
            }}
            padding="4px 10px"
          >
            <Grid item xs={0}>
              {vaccine && (
                <VaccineLots
                  vaccine={vaccine}
                  onLotAdded={resetPage}
                  onLotDelete={resetPage}
                  onLotUpdated={resetPage}
                />
              )}
            </Grid>
          </Box>
        </Stack>
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

export default VaccineDetail;
