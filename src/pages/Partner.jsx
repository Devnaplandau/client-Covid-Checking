import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import GetAppIcon from "@mui/icons-material/GetApp";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { Button, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import partnerApi from "../api/partnerApi";
import { PageHeader } from "../components";

import { LoadingButton } from "@mui/lab";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

const Partner = () => {
  const [partnerList, setPartnerList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [onDelete, setOnDelete] = useState(false);

  useEffect(() => {
    const getPartner = async () => {
      try {
        const res = await partnerApi.getAll();
        setPartnerList(res);
        // console.log(partnerList);
      } catch (err) {
        console.log(err);
      }
    };
    getPartner();
  }, []);

  const deleteLot = async (id) => {
    if (onDelete) return;
    setOnDelete(true);
    try {
      await partnerApi.delete(id);
      const res = await partnerApi.getAll();
      setPartnerList(res);
    } catch (error) {
      console.log(error);
    } finally {
      setOnDelete(false);
    }
  };

  const tableHeader = [
    {
      field: "fullName",
      headerName: "Tên Đối Tác",
      flex: 1,
    },
    {
      field: "password",
      headerName: "mật khẩu",
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
            to={`/partner/admin/edit/${params.value}`}
            startIcon={<LaunchOutlinedIcon />}
          >
            Sửa
          </Button>

          {"|"}

          <Button
            color="error"
            disableElevation
            endIcon={<DeleteOutlinedIcon />}
            loading={onDelete}
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
        title="Quản Lí Đối Tác"
        rightContent={
          <Button
            variant="contained"
            component={Link}
            to="/partner/admin/create"
            startIcon={<AccessibilityNewIcon />}
          >
            Tạo Đối Tác
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={partnerList}
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

export default Partner;
