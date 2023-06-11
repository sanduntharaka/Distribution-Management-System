import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import UserCreation from './pages/users/UserCreation';
import './sass/main.scss';
import AddInventory from './pages/inventory/AddInventory';
import UserTabs from './pages/users/UserTabs';
import CreateDealer from './pages/dealer/CreateDealer';
import InvoiceTab from './pages/invoices/InvoiceTab';
import CreateBill from './pages/bill/CreateBill';
import ReturnTab from './pages/returns/ReturnTab';
import PurchTab from './pages/purchase/PurchTab';
import Login from './pages/login/Login';
import FogotPassword from './pages/login/FogotPassword';
import CreateNewPassword from './pages/login/CreateNewPassword';
import { useSelector } from 'react-redux';
import Dashboard from './pages/dashboard/Dashboard';
import InventoryTabs from './pages/inventory/InventoryTabs';
import DistributionTabs from './pages/distribution/DistributionTabs';
import SalesTabs from './pages/sales/SalesTabs';
import DealersTab from './pages/dealer/DealersTab';
import BillingTab from './pages/bill/BillingTab';
import PsaTab from './pages/psa/PsaTab';
import Profile from './pages/profile/Profile';
import LeaveTab from './pages/leavesheet/LeaveTab';
import ReportsTab from './pages/reports/ReportsTab';
import SalseReturnTab from './pages/salesreturn/SalseReturnTab';
import MainSettings from './pages/settings/MainSettings';
import ConfirmTab from './pages/confirm/ConfirmTab';
import PastTab from './pages/past/PastTab';

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  if (!userInfo) {
    return (
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="forgot" element={<FogotPassword />} />
          <Route path="reset/:uuid/:token" element={<CreateNewPassword />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Layout>
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/user" element={<UserTabs />} />
          <Route path="/inventory" element={<InventoryTabs />} />
          <Route path="/distribution" element={<DistributionTabs />} />
          {/* <Route path="/sales" element={<SalesTabs />} /> */}
          <Route path="/psa" element={<PsaTab />} />
          <Route path="/invoice" element={<InvoiceTab />} />
          <Route path="/dealer" element={<DealersTab />} />
          <Route path="/bill" element={<BillingTab />} />
          <Route path="/past" element={<PastTab />} />

          <Route path="/confirm" element={<ConfirmTab />} />

          <Route path="/purchase" element={<PurchTab />} />
          <Route path="/mreturn" element={<ReturnTab />} />
          <Route path="/sreturn" element={<SalseReturnTab />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leave" element={<LeaveTab />} />
          <Route path="/report" element={<ReportsTab />} />
          <Route path="/settings" element={<MainSettings />} />
        </Routes>
      </Layout>
    );
  }
}

export default App;
