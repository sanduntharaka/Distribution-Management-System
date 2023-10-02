import React, { useState, useEffect } from 'react';
import NotPerchase from './NotPerchase';
import NotBuyDetails from './NotBuyDetails';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
const MyMessage = React.forwardRef((props, ref) => {
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
const PurchTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userdetail = JSON.parse(sessionStorage.getItem('user_details'));
  const [selected, setSelected] = useState(user.is_salesref ? 0 : 1);

  //message modal
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [inventory, setInventory] = useState();

  const handleSelect = (i) => {
    setSelected(i);
  };

  useEffect(() => {
    // JSON.parse(sessionStorage.getItem('user_details')).id
    setIsLoading(true);
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
          setInventory(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('This user has not inventory assigned.');
          setTitle('Error');
          handleOpen();
        });
    }
  }, []);
  return (
    <div className="tab">
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="tab_contaner">
        {user.is_salesref ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            None Buy
          </div>
        ) : (
          ''
        )}

        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          All Reasons
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 && isLoading === false && inventory !== undefined ? (
          <NotPerchase inventory={inventory} />
        ) : selected === 1 ? (
          <NotBuyDetails user={user} userdetail={userdetail} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default PurchTab;
