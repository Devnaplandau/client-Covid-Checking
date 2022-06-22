import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import vaccineApi from "../api/vaccineApi";
import useApi from "../api/userApi";
import { CustomDialog } from "../components";
import { LoadingButton } from "@mui/lab";

const UserVaccine = ({ user }) => {
  const [userVaccines, setUserVaccines] = useState(user.vaccinated);
  const [vaccineList, setVaccineList] = useState([]);
  const [vaccineLots, setVaccineLots] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState();
  const [selectedLot, setSelectedLot] = useState();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [onAddVaccinated, setOnAddVaccinated] = useState(false);

  useEffect(() => {
    const getVaccines = async () => {
      try {
        const res = await vaccineApi.getAll();
        // console.log(res);
        setVaccineList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getVaccines();
  }, []);

  useEffect(() => {
    if (!selectedVaccine) {
      setVaccineLots([]);
      setSelectedLot(null);
      return;
    }
    setVaccineLots(selectedVaccine.vaccineLots);
  }, [selectedVaccine]);

  // console.log(userVaccines);
  const tableHeader = [
    {
      field: "vaccine",
      headerName: "Lô Vaccine",
      flex: 1,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/vaccine/${params.value.id}`}
          sx={{ textTransform: "none" }}
        >
          {params.value.name}
        </Button>
      ),
    },
    {
      field: "vaccineLot",
      headerName: "Tên Vaccine",
      width: 170,

      renderCell: (params) => params.value.name,
    },
    // {
    //   field: "createdAt",
    //   headerName: "Ngày Khai Báo",
    //   flex: 1,
    //   renderCell: (params) =>
    //     moment(params.value).format("DD/MM/YYYY HH:mm:ss"),
    // },
    {
      field: "createdAt",
      headerName: "Ngày Khai Báo",
      flex: 1,
      renderCell: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "ok",
      headerName: "Giờ Khai Báo",
      flex: 1,
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
  ];

  const closeAddDialog = () => {
    setSelectedVaccine(null);
    setShowAddDialog(false);
  };

  const addVaccinated = async () => {
    if (onAddVaccinated) return;
    const err = [!selectedVaccine, !selectedLot];

    if (!err.every((e) => !e)) return;
    setOnAddVaccinated(true);
    const params = {
      userId: user.id,
      vaccineId: selectedVaccine.id,
      vaccineLotId: selectedLot.id,
    };
    try {
      const res = await useApi.vaccinated(params);
      setUserVaccines([res, ...userVaccines]);
      closeAddDialog();
    } catch (err) {
      console.log(err);
    } finally {
      setOnAddVaccinated(false);
    }
  };
  return (
    <>
      <Card elevation={0}>
        <CardHeader
          title={<Typography variant="h6">Số Mũi Vaccine Đã Tiêm</Typography>}
          action={
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowAddDialog(true)}
            >
              Thêm Mũi Tiêm
            </Button>
          }
        ></CardHeader>
        <CardContent>
          <DataGrid
            autoHeight
            rows={userVaccines}
            columns={tableHeader}
            pageSize={3}
            rowsPerPageOptions={[3]}
            density="comfortable"
            showCellRightBorder
            showColumnRightBorder
          />
        </CardContent>
      </Card>
      <CustomDialog
        open={showAddDialog}
        title="Thêm Mũi Đã Tiêm"
        content={
          <Box sx={{ width: "400px" }}>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                options={vaccineList}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box {...props} component="li">
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lô Vaccine"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
                value={selectedVaccine}
                onChange={(event, value) => setSelectedVaccine(value)}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                options={vaccineLots}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box {...props} component="li">
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tên Vaccine"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
                value={selectedLot}
                onChange={(event, value) => setSelectedLot(value)}
              />
            </FormControl>
          </Box>
        }
        actions={
          <Stack
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            direction="row"
            spacing={2}
            width="100%"
          >
            <LoadingButton
              variant="contained"
              onClick={addVaccinated}
              loading={onAddVaccinated}
            >
              Thêm
            </LoadingButton>
            <Button
              variant="text"
              onClick={closeAddDialog}
              disabled={onAddVaccinated}
            >
              Hủy
            </Button>
          </Stack>
        }
      />
    </>
  );
};

export default UserVaccine;
