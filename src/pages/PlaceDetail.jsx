import { useEffect, useState } from "react";
import placeApi from "../api/placeApi";
import { PageHeader } from "../components";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
  CardHeader,
} from "@mui/material";

import QRCode from "qrcode.react";
// import { QRCode } from "react-qrcode-logo";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import GetAppIcon from "@mui/icons-material/GetApp";
import tdLogo from "../assets/images/TD.png";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";

const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState();
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    const getPlace = async () => {
      try {
        const res = await placeApi.getOne(id);
        console.log(res);
        console.log(res.userVisitLast24h);
        setPlace(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPlace();
  }, []);

  const tableHeader = [
    {
      field: "user",
      headerName: "Tên Người Khai Báo",
      width: 220,
      renderCell: (params) => (
        <Button
          variant="text"
          component={Link}
          to={`/user/${params.row.user._id}`}
        >
          {params.row.user.fullName}
        </Button>
      ),
    },

    {
      field: "address",
      headerName: "Địa Chỉ",
      width: 150,
      renderCell: (params) => params.row.user.address,
    },
    {
      field: "createdAt",
      headerName: "Ngày Khai Báo",
      flex: 1,
      renderCell: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "",
      headerName: "Giờ Khai Báo",
      flex: 1,
      renderCell: (params) => moment(params.row.createdAt).format("HH:mm:ss"),
    },
  ];

  const downloadQR = () => {
    const canvas = document.getElementById("place-qr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log("pngUrl", pngUrl);
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-down.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <PageHeader title="Địa Điểm" />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card elevation={0}>
            <CardContent>
              {place && (
                <Stack spacing={2}>
                  <div>
                    <Typography variant="body2">Tên Địa Điểm</Typography>
                    <Typography variant="h6">{place.name}</Typography>
                  </div>

                  <div>
                    <Typography variant="body2">Khu Vực</Typography>
                    <Typography variant="h6">{place.address}</Typography>
                  </div>

                  {/* <div>
                    <Typography variant="body2">Người Tạo</Typography>
                    <Button
                      variant="text"
                      component={Link}
                      to={`/user/${place.creator.id}`}
                    >
                      {place.creator.fullName}
                    </Button>
                  </div> */}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card elevation={0}>
            <CardContent>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "2rem",
                  }}
                >
                  {place && (
                    <QRCode
                      id="place-qr"
                      value={place.id}
                      size={300}
                      level="H"
                      includeMargin={true}
                      crossorigin="anonymous"
                      imageSettings={{
                        src: `${tdLogo}`,
                        excavate: true,
                        height: 60,
                        width: 90,
                      }}
                      renderAs="canvas"
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<GetAppIcon />}
                    onClick={downloadQR}
                  >
                    {" "}
                    Tải Xuống QR{" "}
                  </Button>
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card elevation={0}>
            <CardHeader
              title={
                <Typography variant="h6">
                  Số người đã khai báo tại đây trong 24 giờ
                </Typography>
              }
            />
            <CardContent>
              {place && (
                <DataGrid
                  autoHeight
                  rows={place.userVisitLast24h}
                  columns={tableHeader}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => setPageSize(size)}
                  rowsPerPageOptions={[9, 50, 100]}
                  density="comfortable"
                  showColumnRightBorder
                  disableSelectionOnClick
                  showCellRightBorder
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceDetail;
