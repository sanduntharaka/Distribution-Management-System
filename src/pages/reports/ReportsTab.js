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
import DailyReport from './dailyreport/DailyReport';
import QuickReports from './quickReports/QuickReports';
const ReportsTab = () => {
  const user_details = JSON.parse(sessionStorage.getItem('user_details'));
  const user = JSON.parse(sessionStorage.getItem('user'));

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState('');
  const handleSelect = (i) => {
    setSelected(i);
  };
  useEffect(() => {
    setLoading(true);
    if (user.is_distributor) {
      axiosInstance
        .get(`/distributor/get/${user_details.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);
          setInventory(res.data.id);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
    if (user.is_salesref) {
      axiosInstance
        .get(
          `/distributor/salesref/inventory/bysalesref/${JSON.parse(sessionStorage.getItem('user_details')).id
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
    }
  }, []);
  return (
    <div className="vtab">
      <div className="vtab_contaner">
        {user.is_manager || user.is_company ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            Staff Details Report
          </div>
        ) : (
          ''
        )}

        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          Current Stock Report
        </div>
        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Dealer Information Report

        </div>
        <div
          className={`item ${selected === 3 ? 'selected' : ''}`}
          onClick={() => handleSelect(3)}
        >
          Sales Report

        </div>
        <div
          className={`item ${selected === 4 ? 'selected' : ''}`}
          onClick={() => handleSelect(4)}
        >
          Market Return Report
        </div>
        <div
          className={`item ${selected === 5 ? 'selected' : ''}`}
          onClick={() => handleSelect(5)}
        >
          Sales Return Report
        </div>
        <div
          className={`item ${selected === 6 ? 'selected' : ''}`}
          onClick={() => handleSelect(6)}
        >
          Pending Orders Report
        </div>
        <div
          className={`item ${selected === 7 ? 'selected' : ''}`}
          onClick={() => handleSelect(7)}
        >
          Payments vs Sales Report

        </div>
        <div
          className={`item ${selected === 8 ? 'selected' : ''}`}
          onClick={() => handleSelect(8)}
        >
          Cheques in Hand Report

        </div>
        <div
          className={`item ${selected === 9 ? 'selected' : ''}`}
          onClick={() => handleSelect(9)}
        >
          Cheques by Period Report
        </div>
        <div
          className={`item ${selected === 10 ? 'selected' : ''}`}
          onClick={() => handleSelect(10)}
        >
          Market Credit Bills Report
        </div>
        <div
          className={`item ${selected === 11 ? 'selected' : ''}`}
          onClick={() => handleSelect(11)}
        >
          Cheque Returns Report

        </div>
        <div
          className={`item ${selected === 12 ? 'selected' : ''}`}
          onClick={() => handleSelect(12)}
        >
          Non Buying Dealers Report

        </div>
        <div
          className={`item ${selected === 13 ? 'selected' : ''}`}
          onClick={() => handleSelect(13)}
        >
          PSA Report
        </div>
        {!user.is_salesref ? (
          <div
            className={`item ${selected === 14 ? 'selected' : ''}`}
            onClick={() => handleSelect(14)}
          >
            Delivery Information Report
          </div>
        ) : (
          ''
        )}
        <div
          className={`item ${selected === 15 ? 'selected' : ''}`}
          onClick={() => handleSelect(15)}
        >
          Delivered Sales Report

        </div>
        <div
          className={`item ${selected === 16 ? 'selected' : ''}`}
          onClick={() => handleSelect(16)}
        >
          Credit Bills Report

        </div>
        {/* {!user.is_salesref ? (
          <div
            className={`item ${selected === 23 ? 'selected' : ''}`}
            onClick={() => handleSelect(23)}
          >
            Old Debtors Report
          </div>
        ) : (
          ''
        )} */}
        {!user.is_salesref ? (
          <div
            className={`item ${selected === 17 ? 'selected' : ''}`}
            onClick={() => handleSelect(17)}
          >
            Collection Sheets
          </div>
        ) : (
          ''
        )}
        {/*
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
        </div> */}
        <div
          className={`item ${selected === 20 ? 'selected' : ''}`}
          onClick={() => handleSelect(20)}
        >
          Dealer Purchase Pattern Report
        </div>
        <div
          className={`item ${selected === 21 ? 'selected' : ''}`}
          onClick={() => handleSelect(21)}
        >
          Dealer Payment Pattern Report
        </div>
        <div
          className={`item ${selected === 22 ? 'selected' : ''}`}
          onClick={() => handleSelect(22)}
        >
          FOC Report

        </div>
        <div
          className={`item ${selected === 24 ? 'selected' : ''}`}
          onClick={() => handleSelect(24)}
        >
          Additional FOC Report
        </div>
        <div
          className={`item ${selected === 25 ? 'selected' : ''}`}
          onClick={() => handleSelect(25)}
        >
          Inventory Status Report

        </div>
        {/* <div
          className={`item ${selected === 26 ? 'selected' : ''}`}
          onClick={() => handleSelect(26)}
        >
          Daily Report

        </div> */}
        {!user.is_salesref ? (
          <div
            className={`item ${selected === 27 ? 'selected' : ''}`}
            onClick={() => handleSelect(27)}
          >
            Quick Reports

          </div>
        ) : ''}
      </div>
      <div className="vtab_page">
        {selected === 0 &&
          (user.is_company ||
            user.is_distributor ||
            user.is_manager ||
            user.is_excecutive) ? (
          <StaffReport />
        ) : selected === 1 ? (
          <StockReport inventory={inventory} user={user} />
        ) : selected === 2 ? (
          <DealerReport user={user} />
        ) : selected === 3 ? (
          <SalesReport inventory={inventory} user={user} user_details={user_details} />
        ) : selected === 4 ? (
          <MarketReturnReport user={user} />
        ) : selected === 5 ? (
          <SalesReturnReport user={user} />
        ) : selected === 6 ? (
          <PendingOrderReport user={user} />
        ) : selected === 7 ? (
          <PaymentsForPerios user={user} />
        ) : selected === 8 ? (
          <ChequeInHand user={user} />
        ) : selected === 9 ? (
          <ChequeByPeriod user={user} />
        ) : selected === 10 ? (
          <MarketCreditReport user={user} />
        ) : selected === 11 ? (
          <ChqueReturnsReport user={user} />
        ) : selected === 12 ? (
          <NonBuyingDealerReport user={user} user_details={user_details} />
        ) : selected === 13 ? (
          <PsaReport user={user} />
        ) : selected === 14 ? (
          <DelevaryReport inventory={inventory} user={user} />
        ) : selected === 15 ? (
          <DistributorDeleveredSalesReport user={user} />
        ) : selected === 16 ? (
          <CreditBillsCollection user={user} />
        ) : selected === 17 ? (
          <CollectionsReport user_details={user_details} user={user} />
        ) : selected === 18 ? (
          <NormalFocReport user={user} />
        ) : selected === 19 ? (
          <TotalOutstanding user={user} />
        ) : selected === 20 ? (
          <DealerPurchasePattern user={user} />
        ) : selected === 21 ? (
          <DealerPaymentPattern user={user} />
        ) : selected === 22 ? (
          <FocReport inventory={inventory} user={user} />
        )
          // : selected === 23 ? (
          //   <OldCreditBillsCollection user={user} />
          // ) 
          : selected === 24 ? (
            <AddtionalFocReport user={user} />
          )
            : selected === 25 ? (
              <DaylyInventoryPeriod user={user} />
            )
              //  : selected === 26 ? (
              //   <DailyReport user={user} user_details={user_details} />
              // ) 
              : selected === 27 ? (
                <QuickReports user={user} user_details={user_details} />
              ) : (
                ''
              )}
      </div>
    </div>
  );
};

export default ReportsTab;
