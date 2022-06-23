import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Checkbox,
  Paper,
  Radio,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
// import placeApi from "../api/placeApi";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import * as XLSX from "xlsx";
import useApi from "../api/userApi";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid";
import { CustomDialog } from "../components";
// import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// -------------------------------------
const UserCheck = () => {
  const [userList, setUserList] = useState();
  const [pageSize, setPageSize] = useState(9);
  const [dataUser, setDataUser] = useState("");
  const [dataPlace, setDataPlace] = useState("");
  const [dataDate, setDataDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [timeAlert, setTimeAlert] = useState("");
  // const [delUserCheck, setDelUserCheck] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogText, setDialogText] = useState("");

  useEffect(() => {
    const getPlace = async () => {
      try {
        const res = await useApi.getPlaceUser();
        console.log(res);
        setUserList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPlace();
  }, []);

  const tableHeader = [
    {
      id: 0,
      field: "fullName",
      headerName: "Tên Người Khai Báo",
    },
    {
      id: 1,
      field: "id",
      headerName: "Địa Chỉ",
    },
    {
      id: 2,
      field: "name",
      headerName: "Tên Địa Điểm",
    },
    {
      id: 3,
      field: "address",
      headerName: "Khu Vực",
    },

    {
      id: 4,
      field: "createdAt",
      headerName: "Ngày Khai Báo",
    },
    {
      id: 5,
      field: "ok",
      headerName: "Giờ Khai Báo",
    },
    {
      id: 6,
      field: "alert",
      headerName: "Đánh Dấu",
    },
    {
      field: "dateCheck",
      headerName: "Thời Gian Đánh Dấu",
      flex: 1,
      align: "center",
      renderCell: (params) => {
        return params.row.userS.map((value) => {
          return value.dateCheck ? value.dateCheck : "chưa có";
        });
      },
    },
  ];

  // console.log(moment()._d.format("HH:mm:ss"));
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
    console.log(value);
    const kqFilter = [];
    const nameInfo = value.user.length;
    const placeInfo = value.place.length;
    const dateInfo = value.date.length;
    const timeStartInfo = value.timeStart.length;
    const timeEndInfo = value.timeEnd.length;
    // console.log(value.user);
    // console.log(value.place);
    // console.log(value.date);

    const req = await useApi.getPlaceUser();

    // xử lí thời gian khi tìm kiếm
    if (timeStartInfo > 1 && timeEndInfo > 1) {
      const kq = req.filter((itemTime) => {
        const setTimeCover = moment(itemTime.createdAt).format("HH:mm:ss");

        return setTimeCover >= value.timeStart && setTimeCover <= value.timeEnd;
      });
      const filter = kq.filter((item) => {
        const setTimeCover = moment(item.createdAt).format("HH:mm:ss");
        const setDateCover = moment(item.createdAt).format("DD/MM/YYYY");

        const infoUser = item.userS.map((user) => {
          return user.fullName.toLowerCase().trim();
        });

        return nameInfo > 1 &&
          placeInfo > 1 &&
          dateInfo > 1 &&
          timeStartInfo > 1 &&
          timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
              infoUser[0] == value.user.toLowerCase() &&
              setDateCover == value.date
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase()
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setDateCover == value.date
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? setDateCover == value.date
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? infoUser[0] == value.user.toLowerCase()
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase()
          : setTimeCover >= value.timeStart && setTimeCover <= value.timeEnd;
      });
      setUserList(filter);
      alert("filter đày đủ time");
    } else {
      const filter = req.filter((item) => {
        const setTimeCover = moment(item.createdAt).format("HH:mm:ss");
        const setDateCover = moment(item.createdAt).format("DD/MM/YYYY");

        const infoUser = item.userS.map((user) => {
          return user.fullName.toLowerCase().trim();
        });
        return nameInfo > 1 &&
          placeInfo > 1 &&
          dateInfo > 1 &&
          timeStartInfo > 1 &&
          timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
              infoUser[0] == value.user.toLowerCase() &&
              setDateCover == value.date &&
              setTimeCover >= value.timeStart
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date &&
            setTimeCover <= value.timeEnd
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase()
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? infoUser[0] == value.user.toLowerCase()
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            setTimeCover <= value.timeEnd
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date &&
            setTimeCover <= value.timeEnd
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date &&
            setTimeCover >= value.timeStart
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setTimeCover <= value.timeEnd &&
            setDateCover == value.date
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setTimeCover >= value.timeStart &&
            setDateCover == value.date
          : nameInfo > 1 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            setTimeCover >= value.timeStart
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? infoUser[0] == value.user.toLowerCase() &&
            setTimeCover <= value.timeEnd
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date
          : nameInfo > 1 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? infoUser[0] == value.user.toLowerCase() &&
            setTimeCover >= value.timeStart
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setTimeCover <= value.timeEnd
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setDateCover == value.date
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase() &&
            setTimeCover >= value.timeStart
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? setDateCover == value.date && setTimeCover >= value.timeStart
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? setDateCover == value.date && setTimeCover <= value.timeEnd
          : nameInfo == 0 &&
            placeInfo > 1 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? item.place.name.toLowerCase() == value.place.toLowerCase()
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo > 1 &&
            timeStartInfo == 0 &&
            timeEndInfo == 0
          ? setDateCover == value.date
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo > 1 &&
            timeEndInfo == 0
          ? setTimeCover >= value.timeStart
          : nameInfo == 0 &&
            placeInfo == 0 &&
            dateInfo == 0 &&
            timeStartInfo == 0 &&
            timeEndInfo > 1
          ? setTimeCover <= value.timeEnd
          : item.place.name.toLowerCase() == value.place.toLowerCase() &&
            infoUser[0] == value.user.toLowerCase() &&
            setDateCover == value.date;
      });
      setUserList(filter);
      alert("fitler thiếu giờ");
    }
    setIsLoading(false);
  };
  // ------------------------------------
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
          "Thời Gian Khai Báo": moment(item.createdAt).format("HH:mm:ss"),
          "Đánh Dấu": user.alert,
          "Thời Gian Đánh Dấu": user.dateCheck,
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
      date: dataDate.length == 0 ? "" : moment(dataDate).format("DD/MM/YYYY"),
      timeStart: timeStart,
      timeEnd: timeEnd,
      // time: moment(dataDate).format("HH:ss:mm"),
    };

    filterData(params);
    setIsLoading(true);
  };
  //  xóa bỏ dữ liệu vào load lại toàn bộ dữ liệu
  const clearData = async () => {
    const getValue = await useApi.getPlaceUser();
    setUserList(getValue);
    setDataUser("");
    setDataPlace("");
    setDataDate("");
    setTimeStart("");
    setTimeEnd("");
  };

  const handleGetValueCheckBox = async (value, e) => {
    console.log(value);
    // setCheckBox(e.target.checked);
    sendDateCheck(value);
  };

  // xử lí check
  const sendDateCheck = async (value) => {
    console.log(value);
    // console.log(value);
    const setChecked = value.includes("true");
    console.log(value.indexOf("|"));
    if (setChecked == true) {
      const sliceId = value.substr(value.indexOf("|") + 1);
      const TimeSet = moment();
      const params = {
        alert: setChecked,
        dateCheck: TimeSet,
      };
      try {
        const res = await useApi.update(sliceId, params);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    } else {
      const setIsChecked = false;
      const setTime = "";

      const sliceId = value.substr(value.indexOf("|") + 1);
      const params = {
        alert: setIsChecked,
        dateCheck: setTime,
      };
      try {
        const res = await useApi.update(sliceId, params);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // handle check by An
  const handleCheck = (item) => {
    // console.log(item);
    const a = item.userS.map((itemUser) => {
      return itemUser.alert;
    });
    return a[0];
  };

  const handleCheckTimeAlert = async () => {
    try {
      const res = await useApi.getPlaceUser();
      handleDelCheck(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelCheck = (res) => {
    const arr = [];
    // const a = moment("24/06/2022", "DD/MM/YYYY")
    //   .add(timeAlert, "days")
    //   .format("DD/MM/YYYY");
    // console.log(a);
    // console.log(res);
    const filter = res.map((itemPlace) => {
      const valueCheck = itemPlace.userS.filter((itemUser) => {
        return (
          moment(moment(itemUser.dateCheck).format("DD/MM/YYYY"), "DD/MM/YYYY")
            .add(timeAlert, "days")
            .format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")
        );
      });
      arr.push(...valueCheck);
    });
    handReUpdateCheck(arr);
  };
  // handle gỡ check if  time alert + time input == time.now()
  const handReUpdateCheck = async (valueFilter) => {
    if (valueFilter.length == 0) {
      setDialogText("Đã Lọc Dữ Liệu !");
      setDialogOpen(true);
      setDialogType("success");
    }
    for (let item of valueFilter) {
      const setIsChecked = false;
      const setTime = "";
      const params = {
        alert: setIsChecked,
        dateCheck: setTime,
      };
      try {
        const res = await useApi.update(item.id, params);
        console.log(res);
        setDialogText("Đã Lọc Dữ Liệu !");
        setDialogOpen(true);
        setDialogType("success");
      } catch (err) {
        setDialogText(err.response.data);
        setDialogOpen(true);
        setDialogType("error");
        console.log(err);
      }
    }
  };
  return (
    <>
      <PageHeader title="Truy Vấn Khai Báo Tiêm Chủng" />
      <Box
        sx={{
          width: "80%",
          height: 340,
          margin: 3,
          mb: 16,
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
          type="date"
          variant="outlined"
          placeholder="Nhập từ khóa muốn tìm kiếm . . ."
          sx={{
            mb: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DateRangeOutlinedIcon />
              </InputAdornment>
            ),
          }}
          value={dataDate}
          onChange={(e) => handleDataDate(e.target.value)}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Giờ Bắt Đầu"
              color="primary"
              fullWidth
              type="time"
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
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Giờ Kết Thúc"
              color="primary"
              fullWidth
              type="time"
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
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </Grid>
        </Grid>

        <LoadingButton
          endIcon={<SearchOutlinedIcon />}
          variant="contained"
          size="medium"
          loading={isLoading}
          sx={{ height: 54, ml: 5, width: 180, mb: 5, mt: 4 }}
          onClick={() => sendData()}
        >
          Tìm Kiếm
        </LoadingButton>
        <Button
          endIcon={<RestartAltOutlinedIcon />}
          variant="contained"
          size="medium"
          sx={{ height: 54, ml: 2, width: 180, mb: 5, mt: 4 }}
          onClick={() => clearData()}
        >
          Làm Mới
        </Button>
      </Box>
      {/* ------------------------ */}

      <PageHeader title="Bảng Truy Vấn Tiêm Chủng" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            endIcon={<SystemUpdateAltOutlinedIcon />}
            variant="contained"
            size="medium"
            sx={{ height: 54, ml: 5, width: 180, mb: 2 }}
            onClick={() => handleOnExport()}
          >
            Xuất File Excel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{
              height: 54,
              ml: 5,
              width: 280,
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
            fullWidth
            label="Số Ngày Tự Chăm Sóc"
            color="primary"
            type="text"
            variant="outlined"
            onChange={(e) => setTimeAlert(e.target.value)}
            placeholder="Nhập số ngày ..."
          />
          <Button
            endIcon={<RestartAltOutlinedIcon />}
            variant="contained"
            size="medium"
            onClick={() => handleCheckTimeAlert()}
            sx={{ height: 54, ml: 1, width: 140, mb: 2 }}
            // onClick={() => handleOnExport()}
          >
            Kiểm Tra
          </Button>
        </Grid>
      </Grid>

      {/* render = table thuần */}

      <div className="container ">
        <table className="table table-bordered table-hover">
          <thead>
            <tr className="table-primary">
              {tableHeader.map((item) => (
                <th key={item.id} scope="col">
                  {item.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userList &&
              userList.map((item) => (
                <tr className="table-light">
                  <td scope="row">
                    {item.userS.map((itemUser) => itemUser.fullName)}
                  </td>
                  <td scope="row">
                    {item.userS.map((itemUser) => itemUser.address)}
                  </td>
                  <td scope="row">{item.place.name}</td>
                  <td scope="row">{item.place.address}</td>
                  <td scope="row">
                    {moment(item.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td scope="row">
                    {moment(item.createdAt).format("HH:mm:ss")}
                  </td>
                  <td scope="row">
                    <Checkbox
                      // defaultChecked
                      defaultChecked={handleCheck(item)}
                      type="checkbox"
                      onChange={(e) =>
                        handleGetValueCheckBox(
                          `${e.target.checked}|${item.userS.map(
                            (itemUser) => itemUser.id
                          )}`,
                          e
                        )
                      }
                    ></Checkbox>
                  </td>
                  <td scope="row">
                    {item.userS.map((itemUser) =>
                      itemUser.dateCheck
                        ? moment(itemUser.dateCheck).format("HH:mm:ss")
                        : "Chưa Có"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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

export default UserCheck;
