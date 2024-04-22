import React, { useEffect, useState, forwardRef, useMemo } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import ProductDetails from './componets/ProductDetails';
import ProductEdit from './componets/ProductEdit';
import ProductDelete from './componets/ProductDelete';
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

import EditIcon from '@mui/icons-material/Edit';
import { formatNumberPrice, formatNumberValue } from '../../var/NumberFormats';
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

const ViewInventoryOthers = ({ user }) => {
  const [tblData, setTableData] = useState([]);
  const columns = useMemo(
    () => [
      {
        title: '#',
        field: 'rowIndex',
        render: (rowData) => rowData?.tableData?.id + 1,
      },
      { title: 'Item Code', field: 'item_code' },
      { title: 'Category', field: 'category_name' },
      { title: 'Description', field: 'description' },
      { title: 'Base', field: 'base' },
      { title: 'Foc', field: 'foc', render: (rowData) => formatNumberValue(rowData.foc), },
      { title: 'Qty', field: 'qty', render: (rowData) => formatNumberValue(rowData.qty), },
    ],
    []
  );
  const [loading, setLoading] = useState(false);
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();

  //edit-details
  const [editdetailsOpen, setEditDetailsOpen] = useState(false);

  //delete-details
  const [deletedetailsOpen, setDeleteDetailsOpen] = useState(false);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (user.is_manager) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/manager/${user.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
    if (user.is_excecutive) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/executive/${user.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
    if (user.is_company) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log('d:', res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
  }, [messageOpen, success]);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    setItemDetails({
      id: value.id,
      item_code: value.item_code,
      description: value.description,
      base: value.base,
      qty: value.qty,
      // employee: value.added_by,
      free_of_charge: value.foc,
    });
    setMessageOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(true);

    handleModalOpen();
  };

  const handleFilterInventory = (e) => {
    if (e.target.value !== '') {
      setLoading(true);

      axiosInstance
        .get(`/distributor/by/others/${e.target.value}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);
          setTableData(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
  };

  const handleEditDetails = (e, value) => {
    setItemDetails({
      id: value.id,
      item_code: value.item_code,
      description: value.description,
      base: value.base,
      category: value.category,
      employee: value.added_by,
    });

    setMessageOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(true);
    handleModalOpen();
  };
  const handleDeleteDetails = (e, value) => {
    setItemDetails({
      id: value.id,
      item_code: value.item_code,
      description: value.description,
      base: value.base,
      qty: value.qty,
      pack_size: value.pack_size,
      whole_sale_price: value.whole_sale_price,
      retail_price: value.retail_price,
      employee: value.added_by,
      free_of_charge: value.foc,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(true);
    handleModalOpen();
  };

  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <ProductDetails
            data={itemDetails}
            showDetails={setDetailsOpen}
            showEdit={setEditDetailsOpen}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            success={setSuccess}
            user={user}
          />
        ) : editdetailsOpen ? (
          <ProductEdit
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
            url={'/distributor/items/edit'}
          />
        ) : deletedetailsOpen ? (
          <ProductDelete
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            url={'/distributor/items/delete'}
          />
        ) : messageOpen ? (
          <Message
            hide={handleModalClose}
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
        <p>View distributor inventory</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <div className="page__pcont__row">
            <div className="page__pcont__row__col">
              <div className="form__row">
                <div className="form__row__col">
                  <div className="form__row__col__label">Distributor</div>
                  <div className="form__row__col__input">
                    <select
                      defaultValue={''}
                      onChange={handleFilterInventory}
                      required
                    >
                      <option value="">Select distributor</option>
                      {distributors.map((item, i) => (
                        <option value={item.id} key={i}>
                          {item.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form__row__col dontdisp"></div>
                <div className="form__row__col dontdisp"></div>
                <div className="form__row__col dontdisp"></div>
              </div>
            </div>
          </div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <MaterialTable
                title={false}
                columns={columns}
                data={tblData}
                isLoading={loading}
                sx={{
                  ['&.MuiTable-root']: {
                    background: 'red',
                  },
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
                  {
                    icon: EditIcon,
                    tooltip: 'Edit details',

                    onClick: (event, rowData) =>
                      handleEditDetails(event, rowData),
                  },
                  {
                    icon: DeleteOutline,
                    tooltip: 'Delete details',
                    onClick: (event, rowData) =>
                      handleDeleteDetails(event, rowData),
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
                      )
                        // : props.action.icon === EditIcon &&
                        //   user.is_company ? (
                        //   <IconButton
                        //     onClick={(event) =>
                        //       props.action.onClick(event, props.data)
                        //     }
                        //     color="primary"
                        //     style={{ color: 'orange' }} // customize the button style
                        //     size="small"
                        //     aria-label={props.action.tooltip}
                        //   >
                        //     <EditIcon />
                        //   </IconButton>
                        // ) : props.action.icon === DeleteOutline &&
                        //   user.is_company ? (
                        //   <IconButton
                        //     onClick={(event) =>
                        //       props.action.onClick(event, props.data)
                        //     }
                        //     color="primary"
                        //     style={{ color: 'red' }} // customize the button style
                        //     size="small"
                        //     aria-label={props.action.tooltip}
                        //   >
                        //     <DeleteOutline />
                        //   </IconButton>
                        // ) 
                        : (
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

export default ViewInventoryOthers;
