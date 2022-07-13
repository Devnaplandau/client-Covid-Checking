import { useState } from "react";
import useApi from "../api/userApi";
import QrReader from "react-qr-reader";
import { PageHeader } from "../components";
import {
  CardContent,
  Grid,
  Card,
  CardActions,
  Button,
  Stack,
  CardHeader,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const QRscan = () => {
  const [onLoadUser, setOnLoadUser] = useState(false);
  const [user, setUser] = useState();

  const handleErr = (err) => {
    console.log(err);
  };

  const handleScan = async (data) => {
    if (onLoadUser) return;
    if (!data) return;
    try {
      setOnLoadUser(true);
      const res = await useApi.getOne(data);
      setUser(res);
    } catch (err) {
      console.log(err);
    } finally {
      setOnLoadUser(false);
    }
  };
  return (
    <>
      <PageHeader title="Truy Cập Thông Tin Nhanh" />
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Card elevation={0}>
            <CardContent>
              <QrReader
                delay={1000}
                onError={handleErr}
                onScan={handleScan}
                style={{ width: "100%" }}
                facingMode="user"
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                disableElevation
                onClick={() => setUser(null)}
              >
                Tải Lại
              </Button>
              <Button
                disabled
                variant="contained"
                // component={Link}
                // to={`/user/${user.id}`}
                // sx={{ textTransform: "none" }}
              >
                Tìm Kiếm Nhanh
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={9}>
          <Stack spacing={4}>
            <Card elevation={0}>
              <CardHeader
                title={
                  <Typography variant="h6">Thông Tin Người Dùng</Typography>
                }
              />

              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <FormControl>
                      {user && (
                        <TextField
                          label="Giới"
                          variant="outlined"
                          value={user.idNumber}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl>
                      {user && (
                        <TextField
                          label="Tên Đầy Đủ"
                          variant="outlined"
                          value={user.fullName}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl>
                      {user && (
                        <TextField
                          label="Số Điện Thoại"
                          variant="outlined"
                          value={user.phoneNumber}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl>
                      {user && (
                        <TextField
                          label="Địa Chỉ"
                          variant="outlined"
                          value={user.address}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card elevation={0}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Thông Tin Vaccine Người Dùng
                  </Typography>
                }
              ></CardHeader>

              <CardContent>
                {user && <UserVaccinated vaccinatedList={user.vaccinated} />}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default QRscan;

const UserVaccinated = ({ vaccinatedList }) => {
  const tableHeader = [
    {
      field: "vaccine",
      headerName: "Lô Vaccine",
      width: 220,
      renderCell: (params) => params.value.name,
    },
    {
      field: "vaccineLot",
      headerName: "Tên Vaccine",
      width: 170,
      renderCell: (params) => params.value.name,
    },
    {
      field: "createdAt",
      headerName: "Ngày Tiêm Tiêm",
      flex: 1,
      renderCell: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "",
      headerName: "Giờ Tiêm Tiêm",
      flex: 1,
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={vaccinatedList}
      columns={tableHeader}
      pageSize={6}
      rowsPerPageOptions={[6]}
      density="comfortable"
      showColumnRightBorder
      showCellRightBorder
    />
  );
};
