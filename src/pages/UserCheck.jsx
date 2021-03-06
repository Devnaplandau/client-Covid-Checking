import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Checkbox,
  Paper,
  Radio,
  Typography,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
import axios from "axios";
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

  const [check, setCheck] = useState(undefined);

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
      headerName: "T??n Ng?????i Khai B??o",
    },
    {
      id: 1,
      field: "id",
      headerName: "?????a Ch???",
    },
    {
      id: 2,
      field: "name",
      headerName: "T??n ?????a ??i???m",
    },
    {
      id: 3,
      field: "address",
      headerName: "Khu V???c",
    },

    {
      id: 4,
      field: "createdAt",
      headerName: "Ng??y Khai B??o",
    },
    {
      id: 5,
      field: "ok",
      headerName: "Gi??? Khai B??o",
    },
    {
      id: 6,
      field: "alert",
      headerName: "C???nh b??o",
    },
    {
      field: "dateCheck",
      headerName: "Th???i Gian Ho??n Th??nh C??ch Ly",
      flex: 1,
      align: "center",
      renderCell: (params) => {
        return params.row.userS.map((value) => {
          return value.dateCheck ? value.dateCheck : "ch??a c??";
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

  // t??m ki???m d??? li???u v?? l???c
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

    // x??? l?? th???i gian khi t??m ki???m
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
      // alert("filter ????y ????? time");
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
          : req;
      });

      setUserList(filter);

      // alert("fitler thi???u gi???");
    }
    setIsLoading(false);
  };
  // ------------------------------------
  //  xu???t file excel
  const handleOnExport = () => {
    const req = userList;
    const arr = new Array();
    // console.log(req);
    const filter = req.filter((item) => {
      // console.log(item.place.address);
      const infoUser = item.userS.map((user) => {
        const params = {
          "T??n Ng?????i Khai B??o": user.fullName, // user
          "?????a Ch??? ": user.address, // user
          "T??n ?????a ??i???m": item.place.address, // address place
          "Khu V???c": item.place.name, // name place
          "Ng??y Khai B??o": moment(item.createdAt).format("DD/MM/YYYY"),
          "Th???i Gian Khai B??o": moment(item.createdAt).format("HH:mm:ss"),
          "????nh D???u": user.alert,
          "Th???i Gian Ho??n Th??nh C??ch Ly": user.dateCheck
            ? moment(user.dateCheck).format("DD/MM/YYYY HH:mm:ss")
            : "Ch??a C??",
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
  // g???i d??? li???u
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
  //  x??a b??? d??? li???u v??o load l???i to??n b??? d??? li???u
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
    // console.log(value);
    sendDateCheck(value);
  };

  // x??? l?? check and send notification for user
  const sendDateCheck = async (value) => {
    // console.log(value);
    const setChecked = value.includes("true");
    const token = value.substr(value.indexOf("token:") + 6);
    // console.log(token);
    if (setChecked == true) {
      const sliceId = value.substr(
        value.indexOf("|") + 1,
        value.indexOf("token") - 6
      );

      const params = {
        alert: setChecked,
        dateCheck: moment().add(timeAlert, "days"),
      };
      console.log(params);
      try {
        const res = await useApi.update(sliceId, params);

        //  g??i th??ng b??o v??? app
        // -------------------------
        await axios({
          method: "post",
          url: "https://fcm.googleapis.com/fcm/send",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "key=AAAAtlqzzoc:APA91bG74FOUVxIFPwYeWcVz225WmNzwYN_FtUq2jjIEMCtuD160ZkOIi9Bi3p_qjvsMg6q7ErRKkRxTZdni8_T1Ks4oxjib8cWDjdaVfJktdN0fw0cVVjMSaylYwWPNzBnu8mtrW6AW",
          },
          data: {
            notification: {
              title: "C???nh b??o !",
              body: "B???n ???? ti???p x??c g???n v???i ng?????i nhi???m Covid - Nhanh ch??ng m??? ???ng d???ng v?? ki???m tra tr???ng th??i ",
            },
            to: `${token}`,
          },
        });
        // =========================
      } catch (err) {
        console.log(err);
      }

      // g???i th??ng b??o ?????n app
    } else {
      const setIsChecked = false;
      const setTime = "";

      const sliceId = value.substr(
        value.indexOf("|") + 1,
        value.indexOf("token") - 7
      );
      // console.log("false :", sliceId);
      const params = {
        alert: setIsChecked,
        dateCheck: setTime,
      };
      console.log(params);
      try {
        await useApi.update(sliceId, params);
        // console.log(res);

        await axios({
          method: "post",
          url: "https://fcm.googleapis.com/fcm/send",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "key=AAAAtlqzzoc:APA91bG74FOUVxIFPwYeWcVz225WmNzwYN_FtUq2jjIEMCtuD160ZkOIi9Bi3p_qjvsMg6q7ErRKkRxTZdni8_T1Ks4oxjib8cWDjdaVfJktdN0fw0cVVjMSaylYwWPNzBnu8mtrW6AW",
          },
          data: {
            notification: {
              title: "Th??ng b??o !",
              body: "B???n ???? ho??n th??nh c??ch ly r???i ????, ch??c m???ng b???n quay l???i v???i c???ng ?????ng!",
            },
            to: `${token}`,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // handle check by An
  const handleCheck = (item) => {
    // console.log(item);
    for (let itemValue of item.userS) {
      return itemValue.alert;
    }
  };

  // -------------------------------------------
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
          // moment(moment(itemUser.dateCheck).format("DD/MM/YYYY"), "DD/MM/YYYY")
          //   .add(timeAlert, "days")
          //   .format("DD/MM/YYYY")
          moment(itemUser.dateCheck).format("DD/MM/YYYY") ==
          moment().format("DD/MM/YYYY")
        );
      });
      arr.push(...valueCheck);
    });
    console.log(arr);
    handReUpdateCheck(arr);
  };
  // handle g??? check if  time alert + time input == time.now()
  const handReUpdateCheck = async (valueFilter) => {
    if (valueFilter.length == 0) {
      setDialogText("???? L???c D??? Li???u !");
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
        setDialogText("???? L???c D??? Li???u !");
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
      <PageHeader title="Truy V???n Khai B??o" />
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
          label="T??n Ng?????i Khai B??o"
          fullWidth
          variant="outlined"
          placeholder="Nh???p t??? kh??a mu???n t??m ki???m . . ."
          value={dataUser}
          onChange={(e) => handleDataUser(e.target.value)}
          sx={{
            mb: 2,
          }}
        />
        <TextField
          label="T??n ?????a ??i???m"
          color="primary"
          fullWidth
          variant="outlined"
          placeholder="Nh???p t??? kh??a mu???n t??m ki???m . . ."
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
          label="Ng??y Khai B??o"
          color="primary"
          fullWidth
          type="date"
          variant="outlined"
          placeholder="Nh???p t??? kh??a mu???n t??m ki???m . . ."
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
              label="Gi??? B???t ?????u"
              color="primary"
              fullWidth
              type="time"
              variant="outlined"
              placeholder="Nh???p t??? kh??a mu???n t??m ki???m . . ."
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
              label="Gi??? K???t Th??c"
              color="primary"
              fullWidth
              type="time"
              variant="outlined"
              placeholder="Nh???p t??? kh??a mu???n t??m ki???m . . ."
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
          T??m Ki???m
        </LoadingButton>
        <Button
          endIcon={<RestartAltOutlinedIcon />}
          variant="contained"
          size="medium"
          sx={{ height: 54, ml: 2, width: 180, mb: 5, mt: 4 }}
          onClick={() => clearData()}
        >
          L??m M???i
        </Button>
      </Box>
      {/* ------------------------ */}

      <PageHeader
        title="B???ng Truy V???n Khai B??o"
        // rightContent={
        //   <Typography variant="h6" component="h2">
        //     Ki???m Tra
        //   </Typography>
        // }
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            endIcon={<SystemUpdateAltOutlinedIcon />}
            variant="contained"
            size="medium"
            sx={{ height: 54, ml: 5, width: 180, mb: 2 }}
            onClick={() => handleOnExport()}
          >
            Xu???t File Excel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{
              height: 54,
              ml: 5,
              width: 200,
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
            fullWidth
            label="S??? Ng??y T??? Ch??m S??c"
            color="primary"
            type="text"
            variant="outlined"
            onChange={(e) => setTimeAlert(e.target.value)}
            placeholder="Nh???p s??? ng??y ..."
          />
          <Button
            endIcon={<RestartAltOutlinedIcon />}
            variant="contained"
            size="medium"
            onClick={() => handleCheckTimeAlert()}
            sx={{ height: 54, ml: 1, width: 128, mb: 2 }}
          >
            C???p Nh???t
          </Button>
        </Grid>
      </Grid>

      {/* render = table thu???n */}

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
                      sx={{
                        display: "flex",
                      }}
                      icon={
                        `${item.userS.filter(
                          (itemUser) => itemUser.alert == true
                        )}` ? (
                          <AccessTimeOutlinedIcon />
                        ) : (
                          <MoreTimeOutlinedIcon />
                        )
                      }
                      defaultChecked={handleCheck(item)}
                      //  checked={handleCheck(item)}
                      onChange={(e) =>
                        handleGetValueCheckBox(
                          `${e.target.checked}|${item.userS.map(
                            (itemUser) => itemUser.id
                          )} |token:${item.userS.map(
                            (itemUser) => itemUser.tokenUser
                          )}`,
                          e
                        )
                      }
                    ></Checkbox>
                  </td>
                  <td scope="row">
                    {item.userS.map((itemUser) =>
                      itemUser.dateCheck
                        ? moment(itemUser.dateCheck).format("DD/MM/YYYY")
                        : "Tr???ng th??i b??nh th?????ng"
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
