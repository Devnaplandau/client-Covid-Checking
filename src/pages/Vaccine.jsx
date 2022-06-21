import { Button, FormControl, Paper, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import vaccineApi from "../api/vaccineApi";
import { PageHeader, CustomDialog } from "../components";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
const Vaccine = () => {
  const [vaccineList, setVaccineList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [showCreateModel, setShowCreateModel] = useState(false);

  useEffect(() => {
    const getVaccines = async () => {
      try {
        const res = await vaccineApi.getAll();
        console.log(res);
        setVaccineList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getVaccines();
  }, []);

  const tableHeader = [
    {
      field: "name",
      headerName: "Lô Vaccine",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          // component={Link}
          // to={`/vaccine/${params.row.id}`}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "quantity",
      headerName: "Tổng Số Lượng Vaccine",
      align: "center",
      flex: 1,
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    // {
    //   field: "vaccinated",
    //   headerName: "Vaccine Đã Tiêm",
    //   align: "center",
    //   flex: 1,
    //   renderCell: (params) => params.value.toLocaleString("de-DE"),
    // },
    {
      field: "id",
      headerName: "Vaccine Hiện Có",
      align: "center",
      flex: 1,
      renderCell: (params) =>
        (params.row.quantity - params.row.vaccinated).toLocaleString("de-DE"),
    },
    {
      field: "vaccineLots",
      headerName: "Số Vaccine Trong Lô",
      flex: 1,
      align: "center",
      renderCell: (params) => params.value.length,
    },
    {
      field: "createdAt",
      headerName: "Ngày",
      flex: 1,
      renderCell: (params) =>
        moment(params.value).format("DD/MM/YYYY HH:mm:ss"),
    },

    {
      field: "",
      headerName: "Tác Vụ",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          component={Link}
          to={`/vaccine/${params.row.id}`}
          startIcon={<InfoOutlinedIcon />}
        >
          Xem Chi Tiết
        </Button>
      ),
    },
  ];

  const onCreateSuccess = (newVaccine) => {
    //  console.log(newVaccine);
    setVaccineList([newVaccine, ...vaccineList]);
    setShowCreateModel(false);
  };

  return (
    <>
      <PageHeader
        title="Danh Sách Vaccine"
        rightContent={
          <Button
            variant="contained"
            disableElevation
            onClick={() => setShowCreateModel(true)}
            startIcon={<AddCircleOutlineOutlinedIcon />}
          >
            Tạo Lô Vaccine
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={vaccineList}
          columns={tableHeader}
          pageSize={pageSize}
          rowsPerPageOptions={[9, 50, 100]}
          onPageSizeChange={(size) => setPageSize(size)}
          density="comfortable"
          showColumnRightBorder
          disableSelectionOnClick
        />
      </Paper>
      <VaccineCreateModal
        show={showCreateModel}
        onClose={() => setShowCreateModel(false)}
        onSuccess={onCreateSuccess}
      />
    </>
  );
};

export default Vaccine;

const VaccineCreateModal = ({ show, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  const createVaccine = async () => {
    // console.log("createVaccine");
    // onSuccess("new vaccine");
    if (onSubmit) return;
    if (!name || name.trim().length === 0) {
      setNameErr(true);
      return;
    }
    setNameErr(false);
    setOnSubmit(true);

    try {
      const res = await vaccineApi.create({ name });
      setName("");
      onSuccess(res);
    } catch (err) {
      console.log(err);
    } finally {
      setOnSubmit(false);
    }
  };
  return (
    <CustomDialog
      open={show}
      title="Thêm Lô vaccine"
      content={
        <Box
          sx={{
            width: 300,
            maxWidth: "100%",
          }}
          padding="4px 10px"
        >
          <FormControl fullWidth>
            <TextField
              label="Tên Lô Vaccine"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameErr}
              size="normal"
            />
          </FormControl>
        </Box>
      }
      actions={
        <Box
          width="100%"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="text" onClick={() => onClose()}>
            Hủy
          </Button>
          <LoadingButton
            variant="contained"
            onClick={createVaccine}
            loading={onSubmit}
          >
            Tạo
          </LoadingButton>
        </Box>
      }
    />
  );
};
