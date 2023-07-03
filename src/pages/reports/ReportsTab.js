import React, { useEffect, useState } from 'react';
import StaffReport from './staffreport/StaffReport';
import StockReport from './stockreport/StockReport';
import DealerReport from './dealerreport/DealerReport';
import SalesReport from './salesreport/SalesReport';
import MarketReturnReport from './marketreturnreport/MarketReturnReport';
import SalesReturnReport from './salesreturnreport/SalesReturnReport';
import PendingOrderReport from './pendingordersreport/PendingOrderReport';
import PaymentsForPerios from './paymentforperiosreport/PaymentsForPerios';
import ChequeInHand from './chequeinhandreport/ChequeInHand';
import ChequeByPeriod from './chequebyperiod/ChequeByPeriod';
import MarketCreditReport from './marketcreditreport/MarketCreditReport';
import ChqueReturnsReport from './chequereturnsreport/ChqueReturnsReport';
import NonBuyingDealerReport from './nonbuyingdealerreport/NonBuyingDealerReport';
import PsaReport from './psareport/PsaReport';
import DelevaryReport from './delevaryreport/DelevaryReport';
import DistributorDeleveredSalesReport from './deleverdsalesreport/DelevaryReport';
import CreditBillsCollection from './creditbillscollection/CreditBillsCollection';
import CollectionsReport from './collectionreport/CollectionsReport';
import NormalFocReport from './normalfocreport/NormalFocReport';
import TotalOutstanding from './totaloutstanding/TotalOutstanding';
import DealerPurchasePattern from './dealerpurchasepattern/DealerPurchasePattern';
import DealerPaymentPattern from './dealerpaymentpattern/DealerPaymentPattern';
import { axiosInstance } from '../../axiosInstance';
import FocReport from './focreport/FocReport';
import OldCreditBillsCollection from './oldbillsreport/OldCreditBillsCollection';
import AddtionalFocReport from './additionalfoc/AddtionalFocReport';
import DaylyInventoryPeriod from './dailyInventoryreport/DaylyInventoryPeriod';
const ReportsTab = () => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState('');
  const handleSelect = (i) => {
    setSelected(i);
  };
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `/distributor/get/${
          JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setInventory(res.data.id);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  return (
    <div className="vtab">
      <div className="vtab_contaner">
        <div
          className={`item ${selected === 0 ? 'selected' : ''}`}
          onClick={() => handleSelect(0)}
        >
          Staff details
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          Stock report
        </div>
        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Dealer list
        </div>
        <div
          className={`item ${selected === 3 ? 'selected' : ''}`}
          onClick={() => handleSelect(3)}
        >
          Sales report
        </div>
        <div
          className={`item ${selected === 4 ? 'selected' : ''}`}
          onClick={() => handleSelect(4)}
        >
          Market return report
        </div>
        <div
          className={`item ${selected === 5 ? 'selected' : ''}`}
          onClick={() => handleSelect(5)}
        >
          Sales return report
        </div>
        <div
          className={`item ${selected === 6 ? 'selected' : ''}`}
          onClick={() => handleSelect(6)}
        >
          Pending orders report
        </div>
        <div
          className={`item ${selected === 7 ? 'selected' : ''}`}
          onClick={() => handleSelect(7)}
        >
          Payments report
        </div>
        <div
          className={`item ${selected === 8 ? 'selected' : ''}`}
          onClick={() => handleSelect(8)}
        >
          Cheque in hand
        </div>
        <div
          className={`item ${selected === 9 ? 'selected' : ''}`}
          onClick={() => handleSelect(9)}
        >
          All cheques
        </div>
        <div
          className={`item ${selected === 10 ? 'selected' : ''}`}
          onClick={() => handleSelect(10)}
        >
          Market credit bills
        </div>
        <div
          className={`item ${selected === 11 ? 'selected' : ''}`}
          onClick={() => handleSelect(11)}
        >
          Cheque returns report
        </div>
        <div
          className={`item ${selected === 12 ? 'selected' : ''}`}
          onClick={() => handleSelect(12)}
        >
          Non buying dealers
        </div>
        <div
          className={`item ${selected === 13 ? 'selected' : ''}`}
          onClick={() => handleSelect(13)}
        >
          Psa report
        </div>
        <div
          className={`item ${selected === 14 ? 'selected' : ''}`}
          onClick={() => handleSelect(14)}
        >
          Delevery report
        </div>
        <div
          className={`item ${selected === 15 ? 'selected' : ''}`}
          onClick={() => handleSelect(15)}
        >
          Delevered sales
        </div>
        <div
          className={`item ${selected === 16 ? 'selected' : ''}`}
          onClick={() => handleSelect(16)}
        >
          Credit bills collection
        </div>
        <div
          className={`item ${selected === 23 ? 'selected' : ''}`}
          onClick={() => handleSelect(23)}
        >
          Old Credit bills collection
        </div>
        <div
          className={`item ${selected === 17 ? 'selected' : ''}`}
          onClick={() => handleSelect(17)}
        >
          Collection sheet
        </div>
        <div
          className={`item ${selected === 18 ? 'selected' : ''}`}
          onClick={() => handleSelect(18)}
        >
          Normal foc report
        </div>
        <div
          className={`item ${selected === 19 ? 'selected' : ''}`}
          onClick={() => handleSelect(19)}
        >
          Total outstanding
        </div>
        <div
          className={`item ${selected === 20 ? 'selected' : ''}`}
          onClick={() => handleSelect(20)}
        >
          Dealer purchase pattern
        </div>
        <div
          className={`item ${selected === 21 ? 'selected' : ''}`}
          onClick={() => handleSelect(21)}
        >
          Dealer payment pattern
        </div>
        <div
          className={`item ${selected === 22 ? 'selected' : ''}`}
          onClick={() => handleSelect(22)}
        >
          Foc report
        </div>
        <div
          className={`item ${selected === 24 ? 'selected' : ''}`}
          onClick={() => handleSelect(24)}
        >
          Addtional Foc report
        </div>
        <div
          className={`item ${selected === 25 ? 'selected' : ''}`}
          onClick={() => handleSelect(25)}
        >
          Inventory status
        </div>
      </div>
      <div className="vtab_page">
        {selected === 0 ? (
          <StaffReport />
        ) : selected === 1 ? (
          <StockReport />
        ) : selected === 2 ? (
          <DealerReport />
        ) : selected === 3 && loading == false && inventory !== undefined ? (
          <SalesReport inventory={inventory} />
        ) : selected === 4 ? (
          <MarketReturnReport />
        ) : selected === 5 ? (
          <SalesReturnReport />
        ) : selected === 6 ? (
          <PendingOrderReport />
        ) : selected === 7 ? (
          <PaymentsForPerios />
        ) : selected === 8 ? (
          <ChequeInHand />
        ) : selected === 9 ? (
          <ChequeByPeriod />
        ) : selected === 10 ? (
          <MarketCreditReport />
        ) : selected === 11 ? (
          <ChqueReturnsReport />
        ) : selected === 12 ? (
          <NonBuyingDealerReport />
        ) : selected === 13 ? (
          <PsaReport />
        ) : selected === 14 ? (
          <DelevaryReport />
        ) : selected === 15 ? (
          <DistributorDeleveredSalesReport />
        ) : selected === 16 ? (
          <CreditBillsCollection />
        ) : selected === 17 ? (
          <CollectionsReport />
        ) : selected === 18 ? (
          <NormalFocReport />
        ) : selected === 19 ? (
          <TotalOutstanding />
        ) : selected === 20 ? (
          <DealerPurchasePattern />
        ) : selected === 21 ? (
          <DealerPaymentPattern />
        ) : selected === 22 ? (
          <FocReport />
        ) : selected === 23 ? (
          <OldCreditBillsCollection />
        ) : selected === 24 ? (
          <AddtionalFocReport />
        ) : selected === 25 ? (
          <DaylyInventoryPeriod />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
