import { LoadingButton } from "@mui/lab";
import {
  TextField,
  FormControl,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { CustomDialog } from "../components";
import vaccineLotApi from "../api/vaccineLotApi";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const VaccineLot = ({ vaccine, onLotAdded, onLotDelete, onLotUpdated }) => {
  //  console.log(vaccine.vaccineLots);
  const [pageSize, setPageSize] = useState(5);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [lotNumber, setLotNumber] = useState("");
  const [lotNumberErr, setLotNumberErr] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [quantityErr, setQuantityErr] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [onUpdate, setOnUpdate] = useState(false);
  const [selectedLot, setSelectedLot] = useState();

  const tableHeader = [
    {
      field: "name",
      headerName: "Tên Vaccine",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Số Lượng",
      width: 130,
      align: "center",
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    {
      field: "vaccinated",
      headerName: "Số Vaccine Đã Sử Dụng",
      flex: 1,
      align: "center",
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    {
      field: "id",
      headerName: "Hiện Có",
      width: 130,
      align: "center",
      renderCell: (params) =>
        (params.row.quantity - params.row.vaccinated).toLocaleString("de-DE"),
    },
    {
      field: "createAt",
      headerName: "Ngày Khai Báo",
      width: 130,
      align: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "",
      headerName: "Giờ Khai Báo",
      width: 130,
      align: "center",
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
    {
      field: "_id",
      headerName: "Tác Vụ",
      flex: 1,
      renderCell: (params) => (
        <Box alignItems="center">
          <Button
            color="error"
            disableElevation
            startIcon={<DeleteOutlinedIcon />}
            loading={onDelete}
            onClick={() => deleteLot(params.row.id)}
          >
            Delete
          </Button>
          <Button
            disableElevation
            startIcon={<ModeEditOutlineOutlinedIcon />}
            onClick={() => selectLot(params.row)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const createLot = async () => {
    if (onSubmit) return;

    const err = [!lotNumber, !quantity];
    setLotNumberErr(!lotNumber);
    setQuantityErr(!quantity);

    if (!err.every((e) => !e)) return;
    setOnSubmit(true);
    const params = {
      vaccineId: vaccine.id,
      name: lotNumber,
      quantity,
    };
    try {
      await vaccineLotApi.create(params);
      setQuantity("");
      setLotNumber("");
      setShowAddDialog(false);
      onLotAdded();
    } catch (error) {
      setOnSubmit(false);
      console.log(error);
    } finally {
      setOnSubmit(false);
    }
  };

  const deleteLot = async (lotId) => {
    if (onDelete) return;
    setOnDelete(true);
    try {
      await vaccineLotApi.delete(lotId);
      onLotDelete();
    } catch (error) {
      console.log(error);
    } finally {
      setOnDelete(false);
    }
  };
  const selectLot = (lot) => {
    setLotNumber(lot.name);
    setQuantity(lot.quantity);
    setSelectedLot(lot);
    setShowUpdateDialog(true);
  };
  const hideUpdateDialog = () => {
    setLotNumber("");
    setQuantity("");
    setSelectedLot(undefined);
    setShowUpdateDialog(false);
  };

  const updateLot = async () => {
    if (onUpdate) return;

    const err = [!lotNumber, !quantity];
    setLotNumberErr(!lotNumber);
    setQuantityErr(!quantity);

    if (!err.every((e) => !e)) return;
    setOnUpdate(true);
    const params = {
      name: lotNumber,
      quantity,
    };
    try {
      await vaccineLotApi.update(selectedLot.id, params);
      setQuantity("");
      setLotNumber("");
      setShowUpdateDialog(false);
      onLotUpdated();
    } catch (error) {
      console.log(error);
    } finally {
      setOnUpdate(false);
    }
  };

  return (
    <>
      <Card elevation={0}>
        <CardHeader
          title={
            <Typography variant="h6">Thông Tin Vaccine Trong Lô</Typography>
          }
          action={
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowAddDialog(true)}
              startIcon={<AddCircleOutlineOutlinedIcon />}
            >
              Thêm Vaccine
            </Button>
          }
        />
        <CardContent>
          <DataGrid
            autoHeight
            rows={vaccine.vaccineLots}
            columns={tableHeader}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 50]}
            onPageSizeChange={(size) => setPageSize(size)}
            density="comfortable"
            // showCellRightBorder
            showColumnRightBorder
            disableSelectionOnClick
          />
        </CardContent>
      </Card>

      <CustomDialog
        open={showAddDialog}
        title="Thêm Vaccine"
        content={
          <Box sx={{ width: "400px" }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Tên Vaccine"
                variant="outlined"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                error={lotNumberErr}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Số Lượng"
                variant="outlined"
                // type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={quantityErr}
              />
            </FormControl>
          </Box>
        }
        actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            width="100%"
          >
            <Button
              variant="text"
              onClick={() => setShowAddDialog(false)}
              loading={onSubmit}
              disabled={onSubmit}
            >
              Hủy
            </Button>
            <LoadingButton
              variant="contained"
              disableElevation
              loading={onSubmit}
              onClick={createLot}
            >
              Lưu
            </LoadingButton>
          </Box>
        }
      />

      <CustomDialog
        open={showUpdateDialog}
        title="Cập Nhật Tên Vaccine"
        content={
          <Box sx={{ width: "400px" }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Tên Vaccine"
                variant="outlined"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                error={lotNumberErr}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Số Lượng"
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={quantityErr}
              />
            </FormControl>
          </Box>
        }
        actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            width="100%"
          >
            <Button
              variant="text"
              onClick={hideUpdateDialog}
              disabled={onUpdate}
            >
              Hủy
            </Button>
            <LoadingButton
              variant="contained"
              disableElevation
              loading={onUpdate}
              onClick={updateLot}
            >
              Cập Nhật
            </LoadingButton>
          </Box>
        }
      />
    </>
  );
};

export default VaccineLot;
