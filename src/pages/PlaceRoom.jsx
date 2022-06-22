import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import GetAppIcon from "@mui/icons-material/GetApp";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { Button, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeApi from "../api/placeApi";
import { PageHeader } from "../components";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { LoadingButton } from "@mui/lab";

const PlaceRoom = () => {
  const [placeList, setPlaceList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [onDelete, setOnDelete] = useState(false);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const res = await placeApi.getAll();
        setPlaceList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaces();
  }, []);

  const deleteLot = async (lotId) => {
    // console.log(lotId);
    if (onDelete) return;
    setOnDelete(true);
    try {
      await placeApi.delete(lotId);
      const res = await placeApi.getAll();
      setPlaceList(res);
    } catch (error) {
      console.log(error);
    } finally {
      setOnDelete(false);
    }
  };

  const tableHeader = [
    {
      field: "name",
      headerName: "Tên Địa Điểm",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Khu Vực",
      flex: 1,
    },

    {
      field: "_id",
      headerName: "Tác Vụ",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            component={Link}
            to={`/place/${params.row.id}`}
            endIcon={<RemoveRedEyeIcon />}
          >
            Xem
          </Button>

          {"|"}

          <Button
            variant="text"
            component={Link}
            to={`/place/edit/${params.value}`}
            startIcon={<LaunchOutlinedIcon />}
          >
            Sửa
          </Button>

          {"|"}

          <Button
            color="error"
            disableElevation
            endIcon={<DeleteOutlinedIcon />}
            loading={onDelete} // do button không có attribute loading
            onClick={() => deleteLot(params.row.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Thống Kê Địa Điểm"
        rightContent={
          <Button
            variant="contained"
            component={Link}
            to="/place/create"
            startIcon={<PlaceOutlinedIcon />}
          >
            Tạo Phòng
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={placeList}
          columns={tableHeader}
          pageSize={pageSize}
          onPageSizeChange={(size) => setPageSize(size)}
          rowsPerPageOptions={[9, 50, 100]}
          showColumnRightBorder
          disableSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default PlaceRoom;
