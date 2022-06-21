import {
  colors,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await adminApi.getSummary();
        // console.log(res);
        setSummaryData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <Stack spacing={4}>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Card elevation={0}>
              <CardContent>
                {summaryData && (
                  <SummaryInfo
                    title="Tổng Người Hiện Có"
                    number={summaryData.totalUser.toLocaleString("de-DE")}
                    icon={
                      <PeopleOutlineOutlinedIcon
                        sx={{
                          fontSize: "3rem",
                        }}
                        color="warning"
                      />
                    }
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card elevation={0}>
              <CardContent>
                {summaryData && (
                  <SummaryInfo
                    title="Số Người Đã Tiêm"
                    number={summaryData.userVaccinated.toLocaleString("de-DE")}
                    icon={
                      <VerifiedUserOutlinedIcon
                        sx={{
                          fontSize: "3rem",
                        }}
                        color="success"
                      />
                    }
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card elevation={0}>
              <CardContent>
                {summaryData && (
                  <SummaryInfo
                    title="Số Vaccine Có Sẵn"
                    number={summaryData.availableVaccineDoes.toLocaleString(
                      "de-DE"
                    )}
                    icon={
                      <AddModeratorOutlinedIcon
                        sx={{
                          fontSize: "3rem",
                        }}
                        color="primary"
                      />
                    }
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card elevation={0}>
              <CardContent>
                {summaryData && (
                  <SummaryInfo
                    title="Tổng Các Địa Điểm"
                    number={summaryData.totalPlace.toLocaleString("de-DE")}
                    icon={
                      <RoomOutlinedIcon
                        sx={{
                          fontSize: "3rem",
                        }}
                        color="primary"
                      />
                    }
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card elevation={0}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Thống Kê Số Lượng Tiêm Chủng
                  </Typography>
                }
              />
              <CardContent>
                {summaryData && (
                  <VaccinatedChart
                    chartData={summaryData.userVaccinatedAnalyst}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* ------------------------------ */}
          <Grid item xs={8}>
            <Card elevation={0}>
              <CardHeader
                title={
                  <Typography variant="h6">Lô Vaccine Mới Nhất</Typography>
                }
                action={
                  <Button
                    variant="text"
                    disableElevation
                    component={Link}
                    to="/vaccine"
                  >
                    Quản Lí Vaccine
                  </Button>
                }
              />
              <CardContent>
                {summaryData && (
                  <LatestVaccineLotTable list={summaryData.latestVaccineLot} />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Stack>
  );
};

export default Dashboard;

const SummaryInfo = ({ title, number, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="body2" fontWeight="600">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="600">
          {number}
        </Typography>
      </Stack>
      <div>{icon}</div>
    </Box>
  );
};

const VaccinatedChart = ({ chartData }) => {
  // console.log(chartData);
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: [
      `Đã Tiêm 1 Mũi ${Math.floor(
        (chartData.userWithOneDose / chartData.totalUser) * 100
      )}%`,
      `Đã Tiêm 2 Mũi Trở Lên ${Math.floor(
        (chartData.userWithAboveTwoDose / chartData.totalUser) * 100
      )}%`,
      `Chưa Tiêm Chủng ${Math.floor(
        (chartData.userWithZeroDose / chartData.totalUser) * 100
      )}%`,
    ],
    datasets: [
      {
        label: "Vaccinated analyst",
        data: [
          chartData.userWithOneDose,
          chartData.userWithAboveTwoDose,
          chartData.userWithZeroDose,
        ],
        backgroundColor: [
          colors.yellow["700"],
          colors.green["700"],
          colors.red["700"],
        ],
        borderColor: [
          colors.yellow["700"],
          colors.green["700"],
          colors.red["700"],
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
    />
  );
};

const LatestVaccineLotTable = ({ list }) => {
  const tableHeader = [
    {
      field: "vaccine",
      headerName: "Lô Vaccine ",
      width: 200,
      renderCell: (params) => params.value.name,
    },
    {
      field: "name",
      headerName: "Tên Vaccine",
      width: 200,
    },

    {
      field: "quantity",
      headerName: "Số Lượng",
      width: 150,
      align: "center",
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },

    {
      field: "createdAt",
      headerName: "Ngày Tạo",
      flex: 1,
      align: "center",
      renderCell: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "ok",
      headerName: "Giờ Tạo",
      flex: 1,
      align: "center",
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
  ];
  return (
    <DataGrid
      autoHeight
      rows={list}
      columns={tableHeader}
      hideFooter
      density="comfortable"
      // showCellRightBorder
      showColumnRightBorder
      disableSelectionOnClick
    />
  );
};
