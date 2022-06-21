import {
  Button,
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
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
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import { LoadingButton } from "@mui/lab";

const User = () => {
  const [userList, setUserList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [address, setAddress] = useState("");

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

  const handleDataUser = (value) => {
    setInfo(value);
  };

  const handleDataAddress = (value) => {
    setAddress(value);
  };

  const sendData = () => {
    const params = {
      user: info.toLowerCase(),
      place: address.toLowerCase(),
    };
    // console.log(userList);
    filterData(params);
    setIsLoading(true);
  };

  const clearData = async () => {
    const res = await useApi.getAll();
    setUserList(res);
    setInfo("");
    setAddress("");
  };

  const filterData = async (value) => {
    console.log(value);
    try {
      const res = await useApi.getAll();
      const filter = res.filter((item) => {
        console.log(item.fullName.toLowerCase());
        return value.user.length > 1 && value.place.length > 1
          ? item.fullName.toLowerCase().trim() == value.user &&
              item.address.toLowerCase() == value.place
          : value.user.length == 0 && value.place.length > 1
          ? item.address.toLowerCase() == value.place
          : item.fullName.toLowerCase().trim() == value.user;
      });
      console.log(filter);
      setUserList(filter);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageHeader
        title="Tìm Kiếm Nhanh"
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
      <Box
        sx={{
          width: "80%",
          height: 290,
          margin: 3,
          mb: 5,
          p: 5,
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlinedIcon />
              </InputAdornment>
            ),
          }}
          color="primary"
          label="Tên Người Người Dùng"
          fullWidth
          variant="outlined"
          placeholder="Nhập từ khóa muốn tìm kiếm . . ."
          value={info}
          onChange={(e) => handleDataUser(e.target.value)}
          sx={{
            mb: 2,
          }}
        />
        <TextField
          label="Tên Địa Chỉ"
          color="primary"
          fullWidth
          variant="outlined"
          placeholder="Nhập từ khóa muốn tìm kiếm . . ."
          sx={{
            mb: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <OtherHousesOutlinedIcon />
              </InputAdornment>
            ),
          }}
          value={address}
          onChange={(e) => handleDataAddress(e.target.value)}
        />

        <LoadingButton
          endIcon={<SearchOutlinedIcon />}
          variant="contained"
          size="medium"
          loading={isLoading}
          sx={{ height: 54, ml: 5, width: 180, mb: 5, mt: 2 }}
          onClick={() => sendData()}
        >
          Tìm Kiếm
        </LoadingButton>

        <Button
          endIcon={<RestartAltOutlinedIcon />}
          variant="contained"
          size="medium"
          sx={{ height: 54, ml: 2, width: 180, mb: 5, mt: 2 }}
          onClick={() => clearData()}
        >
          Làm Mới
        </Button>
      </Box>
      {/* --------------------------- */}
      <PageHeader title="Thông Tin Người Dùng" />
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
