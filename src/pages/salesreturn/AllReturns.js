import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';

import Message from '../../components/message/Message';
import { CgDetailsMore } from 'react-icons/cg';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DetailsReturn from '../../components/details/DetailsReturn';
import ReturnDelete from '../../components/userComfirm/ReturnDelete';
import ViewBill from './bill/ViewBill';
import Spinner from '../../components/loadingSpinner/Spinner';
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const AllReturns = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Invoice', field: 'code' },
    { title: 'Psa', field: 'psa_name' },
    { title: 'Dealer', field: 'dealer_name' },
    { title: 'Date', field: 'date' },
    { title: 'Added By', field: 'added_name' },
  ];

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();
  const [returnItems, setReturnItems] = useState([]);

  //filter_lists
  const [sales_refs, setSales_refs] = useState([]);

  const [loading, setLoading] = useState(false);
  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (user.is_salesref) {
      setLoading(true);
      axiosInstance
        .get(
          `/salesreturn/return/get/salesref/${JSON.parse(sessionStorage.getItem('user_details')).id
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

          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    if (user.is_distributor) {
      setLoading(true);
      axiosInstance
        .get(
          `/salesreturn/return/get/distributor/${JSON.parse(sessionStorage.getItem('user_details')).id
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

          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, ['']);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .get(`/salesreturn/return/get/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setItemDetails(value);
        setReturnItems(res.data);
        setMessageOpen(false);
        setDetailsOpen(true);

        handleModalOpen();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Cannot view bill. Beacause you did not added items. Please delete the bill.'
        );
        setDetailsOpen(false);

        setMessageOpen(true);

        handleModalOpen();
      });
  };

  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <ViewBill
        issued_by={props.issued_by}
        items={props.items}
        invoice={props.invoice}
        data={props.data}
        user={props.user}
        close={() => props.handleClose()}
      />
    );
  });
  const ShowMessage = forwardRef((props, ref) => {
    return (
      <Message
        hide={() => props.handleClose()}
        success={props.success}
        error={props.error}
        title={props.title}
        msg={props.msg}
        ref={ref}
      />
    );
  });

  return (
    <div className="page">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <MyInvoice
            issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
            items={returnItems}
            invoice={itemDetails}
            oldinv={false}
            data={itemDetails}
            user={user}
            handleClose={handleModalClose}
          />
        ) : messageOpen ? (
          <ShowMessage
            handleClose={handleModalClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        ) : (
          <p>No modal</p>
        )}
      </Modal>
      <div className="page__title">
        <p>View all Issued Sales Returns</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <MaterialTable
                title={false}
                columns={columns}
                data={tblData}
                sx={{
                  ['&.MuiTable-root']: {
                    background: 'red',
                  },
                }}
                actionsColumnIndex={-1} // hide the actions column from view
                actionsCellStyle={{
                  // customize the actions cell style
                  background: '#fde',
                }}
                options={{
                  exportButton: true,
                  actionsColumnIndex: 0,
                  pageSize: 50,
                  pageSizeOptions: [50, 75, 100],
                }}
                icons={tableIcons}
                actions={[
                  {
                    icon: CgDetailsMore,
                    tooltip: 'View details',
                    onClick: (event, rowData) =>
                      handleViewDetails(event, rowData),
                  },
                ]}
                components={{
                  Action: (props) => (
                    <React.Fragment>
                      {props.action.icon === CgDetailsMore ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'green' }} // customize the icon color
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <CgDetailsMore />
                        </IconButton>
                      ) : (
                        ''
                      )}
                    </React.Fragment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReturns;
