import {
  Button,
  Box,
  Typography,
  Paper,
  Input,
  TextField,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
// import placeApi from "../api/placeApi";
import useApi from "../api/userApi";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import * as XLSX from "xlsx";

const UserCheck = () => {
  const [userList, setUserList] = useState();
  const [pageSize, setPageSize] = useState(9);
  const [dataUser, setDataUser] = useState("");
  const [dataPlace, setDataPlace] = useState("");
  const [dataDate, setDataDate] = useState("");

  useEffect(() => {
    const getPlace = async () => {
      try {
        const res = await useApi.getPlaceUser();
        // console.log(res);
        setUserList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPlace();
  }, []);

  const tableHeader = [
    // {
    //   field: "fullName",
    //   headerName: "Tên Người Khai Báo",
    //   width: 220,
    //   renderCell: (params) => userList.userVisitLast24h.user.fullName,
    // },
    {
      field: "fullName",
      headerName: "Tên Người Khai Báo",
      flex: 1,
      renderCell: (params) => {
        return params.row.userS.map((value) => {
          return value.fullName;
        });
      },
    },
    {
      field: "id",
      headerName: "Địa Chỉ",
      flex: 1,
      renderCell: (params) => {
        return params.row.userS.map((value) => {
          return value.address;
        });
      },
    },
    {
      field: "name",
      headerName: "Tên Địa Điểm",
      flex: 1,

      renderCell: (params) => params.row.place.name,
    },
    {
      field: "address",
      headerName: "Khu Vực",
      flex: 1,
      renderCell: (params) => params.row.place.address,
    },

    {
      field: "createdAt",
      headerName: "Ngày Khai Báo",
      flex: 1,
      align: "center",
      renderCell: (params) => moment(params.row.createdAt).format("DD/MM/YYYY"),
    },
    {
      field: "",
      headerName: "Giờ Khai Báo",
      flex: 1,
      align: "center",
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
  ];

  const handleDataUser = async (value) => {
    setDataUser(value);
  };
  const handleDataPlace = async (value) => {
    setDataPlace(value);
  };
  const handleDataDate = async (value) => {
    setDataDate(value);
  };

  // tìm kiếm dữ liệu và lọc
  const filterData = async (value) => {
    console.log(value.user);
    console.log(value.place);
    console.log(value.date);
    const req = await useApi.getPlaceUser();
    const filter = req.filter((item) => {
      const infoUser = item.userS.map((user) => {
        return user.fullName.toLowerCase();
      });
      // moment(item.createdAt).format("DD/MM/YYYY");

      return value.user.length > 1 &&
        value.place.length > 1 &&
        value.date.length > 1
        ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            moment(item.createdAt).format("DD/MM/YYYY") == value.date
        : value.date.length == 0 &&
          value.place.length == 0 &&
          value.user.length > 1
        ? infoUser[0] == value.user.toLowerCase()
        : value.date.length == 0 &&
          value.place.length > 1 &&
          value.user.length == 0
        ? item.place.name.toLowerCase() == value.place.toLowerCase()
        : value.date.length > 1 &&
          value.place.length == 0 &&
          value.user.length == 0
        ? moment(item.createdAt).format("DD/MM/YYYY") == value.date
        : value.date.length == 0 &&
          value.place.length > 1 &&
          value.user.length > 1
        ? infoUser[0] == value.user.toLowerCase() &&
          moment(item.createdAt).format("DD/MM/YYYY") == value.date
        : value.date.length > 1 &&
          value.place.length > 1 &&
          value.user.length == 0
        ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
          moment(item.createdAt).format("DD/MM/YYYY") == value.date
        : item.place.name.toLowerCase() == value.place.toLowerCase() &&
          moment(item.createdAt).format("DD/MM/YYYY") == value.date;
      //  xử lí các trường hợp còn lại nhập thiếu 1, 2, 3 ô
    });
    console.log(filter);
    setUserList(filter);
  };
  //  xuất file excel
  const handleOnExport = () => {
    const req = userList;
    const arr = new Array();
    // console.log(req);
    const filter = req.filter((item) => {
      // console.log(item.place.address);
      const infoUser = item.userS.map((user) => {
        const params = {
          "Tên Người Khai Báo": user.fullName, // user
          "Địa Chỉ ": user.address, // user
          "Tên Địa Điểm": item.place.address, // address place
          "Khu Vực": item.place.name, // name place
          "Ngày Khai Báo": moment(item.createdAt).format("DD/MM/YYYY"),
          "Thời Gian Khai Báo": moment(item.createdAt).format("HH:ss:mm"),
        };

        return params;
      });
      // console.log(...infoUser);
      arr.push(...infoUser);
      // return infoUser;
    });
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "DanhSachTruyVanNguoiDung.xlsx");
  };
  // gửi dữ liệu
  const sendData = () => {
    const params = {
      user: dataUser,
      place: dataPlace,
      date: dataDate,
    };
    filterData(params);
  };
  //  xóa bỏ dữ liệu vào load lại toàn bộ dữ liệu
  const clearData = async () => {
    const getValue = await useApi.getPlaceUser();
    setUserList(getValue);
    setDataUser("");
    setDataPlace("");
    setDataDate("");
  };

  return (
    <>
      <PageHeader title="Truy Vấn Khai Báo Tiêm Chủng" />
      <Box
        sx={{
          width: 460,
          height: 54,
          margin: 3,
          mb: 30,
          // backgroundColor: "#fff",
          borderRadius: "4px",
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
          label="Tên Người Khai Báo"
          fullWidth
          variant="outlined"
          placeholder="Nhập từ khóa muốn tìm kiếm . . ."
          value={dataUser}
          onChange={(e) => handleDataUser(e.target.value)}
          sx={{
            mb: 2,
          }}
        />
        <TextField
          label="Tên Địa Điểm"
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
          value={dataPlace}
          onChange={(e) => handleDataPlace(e.target.value)}
        />
        <TextField
          label="Ngày Khai Báo"
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
                <AccessTimeOutlinedIcon />
              </InputAdornment>
            ),
          }}
          value={dataDate}
          onChange={(e) => handleDataDate(e.target.value)}
        />
        <LoadingButton
          endIcon={<SearchOutlinedIcon />}
          variant="contained"
          size="medium"
          sx={{ height: 54, ml: 5, width: 180, mb: 5 }}
          onClick={() => sendData()}
        >
          Tìm Kiếm
        </LoadingButton>
        <Button
          endIcon={<RestartAltOutlinedIcon />}
          variant="contained"
          size="medium"
          sx={{ height: 54, ml: 2, width: 180, mb: 5 }}
          onClick={() => clearData()}
        >
          Làm Mới
        </Button>
      </Box>
      <PageHeader title="Bảng Truy Vấn Tiêm Chủng" />
      <Button
        endIcon={<SystemUpdateAltOutlinedIcon />}
        variant="contained"
        size="medium"
        sx={{ height: 54, ml: 5, width: 180, mb: 2 }}
        onClick={() => handleOnExport()}
      >
        Xuất File Excel
      </Button>
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

export default UserCheck;
