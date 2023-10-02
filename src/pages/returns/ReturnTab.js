import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import CreateReturn from './CreateReturn';
import AllReturns from './AllReturns';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import MarketReturnConfirm from './marcketreturnconfirm/MarketReturnConfirm';
import ViewMarketReturnByOthers from './ViewMarketReturnByOthers';
import ViewAllMarketReturnsConfimsByOthers from './marcketreturnconfirm/ViewAllMarketReturnsConfimsByOthers';

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
const ReturnTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [inventory, setInventory] = useState();
  const [selected, setSelected] = useState(user.is_salesref ? 0 : 1);
  const [isLoading, setIsLoading] = useState(false);

  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelect = (i) => {
    setSelected(i);
  };

  useEffect(() => {
    //
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
    if (user.is_distributor) {
      axiosInstance
        .get(
          `/distributor/get/${JSON.parse(sessionStorage.getItem('user_details')).id
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
            Add Returns
          </div>
        ) : (
          ''
        )}
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          All Returns
        </div>

        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Approve Market Returns
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 && isLoading === false && inventory !== undefined ? (
          <CreateReturn inventory={inventory} />
        ) : selected === 1 &&
          isLoading === false &&
          inventory !== undefined &&
          (user.is_distributor || user.is_salesref) ? (
          <AllReturns inventory={inventory} />
        ) : selected === 1 ? (
          <ViewMarketReturnByOthers user={user} />
        ) : selected === 2 &&
          isLoading === false &&
          inventory !== undefined &&
          user.is_distributor ? (
          <MarketReturnConfirm />
        ) : selected === 2 ? (
          <ViewAllMarketReturnsConfimsByOthers user={user} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
export default ReturnTab;
