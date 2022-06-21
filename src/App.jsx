import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  AppLayout,
  Dashboard,
  User,
  UserCreate,
  UserDetail,
  Vaccine,
  VaccineDetail,
  Place,
  PlaceDetail,
  QRscan,
  PlaceRoom,
  PlaceCreate,
  EditPlace,
  UserCheck,
  LoginPartner,
  Partner,
  PartnerCreate,
  PartnerEdit,
} from "./pages";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login/partner" element={<LoginPartner />} />
        <Route path="login/admin" element={<Login />} />
        <Route path="" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/create" element={<UserCreate />} />
          <Route path="/check" element={<UserCheck />} />
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/vaccine" element={<Vaccine />} />
          <Route path="/vaccine/:id" element={<VaccineDetail />} />
          {/* <Route path="/place" element={<Place />} /> */}
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/qr-scan" element={<QRscan />} />
          <Route path="/placeroom" element={<PlaceRoom />} />
          <Route path="/place/create" element={<PlaceCreate />} />
          <Route path="/place/edit/:id" element={<EditPlace />} />
          <Route path="/partner/admin" element={<Partner />} />
          <Route path="/partner/admin/create" element={<PartnerCreate />} />
          <Route path="/partner/admin/edit/:id" element={<PartnerEdit />} />
        </Route>
      </Routes>
      {/* <Route path="/partner" element={<AppLayoutPartner />} /> */}
      {/* <Route path="/partner" element={<AppLayoutPartner />}></Route> */}
    </BrowserRouter>
  );
}

export default App;
