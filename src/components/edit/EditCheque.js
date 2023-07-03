import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';

const EditCheque = (props) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    id: '',
    bank: '',
    branch: '',
    cheque_number: '',
    deposited_at: '',
    number_of_dates: 0,
    status: '',
  });
  useEffect(() => {
    axiosInstance
      .get(`/salesref/invoice/get/payment/cheque/${props.paymentId}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log('cc:', res.data);
        setData({
          ...data,
          id: res.data.id,
          bank: res.data.bank,
          branch: res.data.branch,
          cheque_number: res.data.cheque_number,
          deposited_at: res.data.deposited_at,
          number_of_dates: res.data.number_of_dates,
          status: res.data.status,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSave = (e) => {
    props.loading(true);
    axiosInstance
      .put(`/salesref/invoice/edit/cheque/${data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        props.close();
        props.loading(false);

        props.success(true);
        props.error(false);
        props.timeout(true);
        props.successmsg('Your cheque datails edited successfully');
      })
      .catch((err) => {
        console.log(err);
        props.close();

        props.loading(false);

        props.success(false);
        props.error(true);
        props.timeout(true);
        props.errormsg('Your cheque cannot edit. please try again later.');
        handleOpen();
      });
  };
  const handleClosePopup = (e) => {
    props.showEditCheques(false);
  };
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit cheque</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>bank</td>
                <td>
                  <input
                    type="text"
                    placeholder="type name here"
                    autoComplete="bank"
                    value={data.bank ? data.bank : ''}
                    onChange={(e) => setData({ ...data, bank: e.target.value })}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>branch</td>
                <td>
                  <input
                    type="text"
                    placeholder="type name here"
                    autoComplete="branch"
                    value={data.branch ? data.branch : ''}
                    onChange={(e) =>
                      setData({ ...data, branch: e.target.value })
                    }
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>cheque number</td>
                <td>
                  <input
                    type="text"
                    placeholder="type name here"
                    autoComplete="cheque_number"
                    value={data.cheque_number ? data.cheque_number : ''}
                    onChange={(e) =>
                      setData({ ...data, cheque_number: e.target.value })
                    }
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>deposited at</td>
                <td>
                  <input
                    type="date"
                    placeholder="type name here"
                    autoComplete="deposited_at"
                    value={data.deposited_at ? data.deposited_at : ''}
                    onChange={(e) =>
                      setData({ ...data, deposited_at: e.target.value })
                    }
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>no of dates</td>
                <td>
                  <input
                    type="number"
                    placeholder="type name here"
                    autoComplete="number_of_dates"
                    value={data.number_of_dates ? data.number_of_dates : ''}
                    onChange={(e) =>
                      setData({ ...data, number_of_dates: e.target.value })
                    }
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>status</td>
                <td>
                  <select
                    name=""
                    id=""
                    value={data.status ? data.status : ''}
                    onChange={(e) =>
                      setData({ ...data, status: e.target.value })
                    }
                  >
                    <option value="pending">pending</option>
                    <option value="cleared">cleared</option>
                  </select>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={(e) => handleSave(e)}>
            <p>Save</p>
          </button>
          <button className="addBtn" onClick={(e) => handleClosePopup(e)}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCheque;
