import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { CgDetailsMore } from 'react-icons/cg';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Message from '../../components/message/Message';
import UserConfirm from '../../components/userComfirm/UserConfirm';
import ProductDetails from './componets/ProductDetails';
import ProductEdit from './componets/ProductEdit';
import ProductDelete from './componets/ProductDelete';
const ViewInventory = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuIndex, setShowMenuIndex] = useState('');
  const [items, setItems] = useState([]);

  //table pagination
  const [curPage, setCurPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = items.slice(firstIndex, lastIndex);
  const npage = Math.ceil(items.length / recordsPerPage);

  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();

  //edit
  const [editOpen, setEditOpen] = useState(false);

  //delete
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/company/inventory/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [open]);
  const handleShowMenu = (i) => {
    setShowMenuIndex(i);
    setShowMenu(true);
  };

  const handlePagi = (e, value) => {
    setCurPage(value);
  };
  const handleShowDetails = (item) => {
    axiosInstance
      .get(`/company/inventory/${item.id}/`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItemDetails(res.data);
        setDeleteOpen(false);
        setEditOpen(false);
        setDetailsOpen(true);
        handleModalOpen();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleShowEdit = (item) => {
    axiosInstance
      .get(`/company/inventory/${item}/`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItemDetails(res.data);
        setDeleteOpen(false);
        setDetailsOpen(false);
        setEditOpen(true);
        handleModalOpen();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleShowDelete = (item) => {
    setDetailsOpen(false);
    setEditOpen(false);
    setDeleteOpen(true);
    setItemDetails(item);
    handleModalOpen();
  };
  return (
    <div className="page">
      <Modal open={open} onClose={handleClose}>
        <Message
          hide={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>

      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <ProductDetails
            data={itemDetails}
            openEdit={handleShowEdit}
            openDelete={handleShowDelete}
          />
        ) : editOpen ? (
          <ProductEdit
            data={itemDetails}
            openMessage={handleOpen}
            success={setSuccess}
            error={setError}
            msg={setMsg}
            title={setTitle}
            closeCurrent={handleModalClose}
          />
        ) : deleteOpen ? (
          <ProductDelete
            data={itemDetails}
            openMessage={handleOpen}
            success={setSuccess}
            error={setError}
            msg={setMsg}
            title={setTitle}
            closeCurrent={handleModalClose}
          />
        ) : (
          <p>No modal</p>
        )}
      </Modal>
      <div className="page__title">
        <p>View inventory</p>
      </div>
      <div className="page__pcont">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Item Code</th>
                <th>Qty</th>
                <th>Wholesale price</th>
                <th>Retail price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr className="sp">
                  <td scope="row">{index + 1}</td>
                  <td>{item.item_code}</td>
                  <td>{item.qty}</td>
                  <td>{item.whole_sale_price}</td>
                  <td>{item.retail_price}</td>

                  <td>
                    <div>
                      {' '}
                      <button
                        className="btn details"
                        title="see more details"
                        onClick={() => handleShowDetails(item)}
                      >
                        <CgDetailsMore />
                      </button>
                      <button
                        className="btn edit"
                        title="edit item"
                        onClick={() => handleShowEdit(item.id)}
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        className="btn delete"
                        title="delete item"
                        onClick={() => handleShowDelete(item.id)}
                      >
                        <AiFillDelete />
                      </button>
                    </div>

                    <div
                      className="action_btn"
                      onClick={() => handleShowMenu(index)}
                    >
                      <BsThreeDotsVertical />
                    </div>
                  </td>
                  {showMenu && index === showMenuIndex ? (
                    <div
                      className="tbl_side_menu"
                      onClick={() => setShowMenu(false)}
                    >
                      <div
                        className="tbl_side_menu__row"
                        onClick={() => handleShowDetails(item)}
                      >
                        Details
                      </div>
                      <div
                        className="tbl_side_menu__row"
                        onClick={() => handleShowEdit(item.id)}
                      >
                        Edit
                      </div>
                      <div
                        className="tbl_side_menu__row"
                        onClick={() => handleShowDelete(item.id)}
                      >
                        Delete
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="pagination">
            <div className="pagination__pagecount">
              <select onChange={(e) => setRecordsPerPage(e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <div>
              <Stack spacing={2}>
                <Pagination
                  count={npage}
                  onChange={(e, value) => handlePagi(e, value)}
                  variant="outlined"
                  color="secondary"
                />
              </Stack>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ViewInventory;
