import React, { useEffect, useState, forwardRef } from 'react';
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

import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
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

const ViewInventory = () => {
  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      cellStyle: { width: '10px' },
      width: '10px',
      headerStyle: { width: '10px' },
    },
    { title: 'Item Code', field: 'item_code' },
    { title: 'Category', field: 'category_name' },
    { title: 'Description', field: 'description' },
    { title: 'Pack Size', field: 'pack_size' },
    { title: 'Whole Sale Price', field: 'whole_sale_price' },
    { title: 'Retail Price', field: 'retail_price' },
    { title: 'Foc', field: 'free_of_charge' },
    { title: 'Qty', field: 'qty' },
  ];

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

  //item_codes
  const [itemCodes, setItemCodes] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    axiosInstance
      .get('/company/inventory/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setTableData(res.data);
        res.data.forEach((item) => {
          if (!itemCodes.includes(item.item_code)) {
            itemCodes.push(item.item_code);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messageOpen]);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
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
      free_of_charge: value.free_of_charge,
    });
    setMessageOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(true);

    handleModalOpen();
  };

  const handleEditDetails = (e, value) => {
    console.log(value);
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
      free_of_charge: value.free_of_charge,
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
      free_of_charge: value.free_of_charge,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(true);
    handleModalOpen();
  };

  const handleFilter = (i) => {
    handleClose();
    console.log(i);
    if (i === 'all') {
      setTableData(data);
    } else {
      let filteredItems = data.filter((item) => item.item_code === i);
      //
      console.log(filteredItems);
      setTableData(filteredItems);
    }
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
            url={'/company/inventory/edit'}
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
            url={'/company/inventory/delete'}
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
        <p>View Company inventory</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div>
              <select
                name=""
                id=""
                onChange={(e) => handleFilter(e.target.value)}
              >
                {' '}
                <option value="" selected>
                  Filter
                </option>
                <option value={'all'}>All</option>
                {itemCodes.map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
              </select>
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
                sx={{
                  ['&.MuiTable-root']: {
                    background: 'red',
                  },
                }}
                options={{
                  exportButton: true,
                  actionsColumnIndex: 0,
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
                      ) : props.action.icon === EditIcon ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'orange' }} // customize the button style
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'red' }} // customize the button style
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <DeleteOutline />
                        </IconButton>
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

export default ViewInventory;
