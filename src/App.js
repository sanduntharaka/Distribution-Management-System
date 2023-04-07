import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import UserCreation from "./pages/users/UserCreation";
import "./sass/main.scss";
import AddInventory from "./pages/inventory/AddInventory";
import UserTabs from "./pages/users/UserTabs";
import CreateDealer from "./pages/dealer/CreateDealer";
import InvoiceTab from "./pages/invoices/InvoiceTab";
import CreateBill from "./pages/bill/CreateBill";
import ReturnTab from "./pages/returns/ReturnTab";
import PurchTab from "./pages/purchase/PurchTab";
import Login from "./pages/login/Login";
import FogotPassword from "./pages/login/FogotPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/fogotpassword" element={<FogotPassword />} />
      </Routes>
      {/* <Layout>
        <Routes>
          <Route path="/user" element={<UserTabs />} />
          <Route path="/inventory" element={<AddInventory />} />
          <Route path="/invoice" element={<InvoiceTab />} />
          <Route path="/dealer" element={<CreateDealer />} />
          <Route path="/bill" element={<CreateBill />} />
          <Route path="/purchase" element={<PurchTab />} />
          <Route path="/return" element={<ReturnTab />} />
        </Routes>
      </Layout> */}
    </BrowserRouter>
  );
}

export default App;
