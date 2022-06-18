import { Button, Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
import { Link } from "react-router-dom";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import useApi from "../api/userApi";
import { DataGrid } from "@mui/x-data-grid";

const User = () => {
  const [userList, setUserList] = useState([]);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await useApi.getAll();
        setUserList(res);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);
  const tableHeader = [
    // {
    //   field: "idNumber",
    //   headerName: "ID card",
    //   renderCell: (params) => (
    //     <Button variant="text" component={Link} to={`/User/${params.row.id}`}>
    //       {params.value}
    //     </Button>
    //   ),
    //   width: 170,
    // },
    {
      field: "fullName",
      headerName: "Tên Đầy Đủ",
      width: 220,
    },
    {
      field: "phoneNumber",
      headerName: "Số Điện Thoại",
      width: 170,
    },
    {
      field: "vaccine",
      headerName: "Mũi Tiêm",
      width: 250,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          color={
            params.value.length > 1
              ? "green"
              : params.value.length === 1
              ? "orange"
              : "red"
          }
        >
          {params.value.length > 1 && <VerifiedUserOutlinedIcon />}
          {params.value.length === 1 && <ShieldOutlinedIcon />}
          {params.value.length < 1 && <ErrorOutlineOutlinedIcon />}
          <Typography
            variant="body2"
            sx={{
              marginLeft: "10px",
              fontWeight: "500",
            }}
          >
            Đã Tiêm {params.value.length} Mũi
            {params.value.length > 1}
          </Typography>
        </Box>
      ),
    },
    { field: "address", headerName: "Địa Chỉ", flex: 1 },
    {
      field: "id",
      headerName: "Tác Vụ",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          component={Link}
          to={`/user/${params.value}`}
          startIcon={<LaunchOutlinedIcon />}
        >
          Xem Chi Tiết
        </Button>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        title="Danh Sách Người Dùng"
        rightContent={
          <Button
            variant="contained"
            component={Link}
            to="/user/create"
            startIcon={<PeopleOutlineOutlinedIcon />}
          >
            Tạo Mới Người Dùng
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={userList}
          columns={tableHeader}
          rowsPerPageOptions={[9, 50, 100]}
          onPageSizeChange={(size) => setPageSize(size)}
          density="comfortable"
          showColumnRightBorder
          disableSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default User;
