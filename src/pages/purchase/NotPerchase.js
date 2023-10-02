import React, { useState, useEffect } from 'react';
import Message from '../../components/message/Message';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../../components/loadingSpinner/Spinner';
import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';

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

const NotPerchase = ({ inventory }) => {
  //message modal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [dealers, setDealers] = useState([]);

  const [data, setData] = useState({
    datetime: new Date().toISOString(),
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    inventory: inventory.id,
    dealer: '',
    reason: '',
    dis_sales_ref: '',
  });

  const [showDealers, setShowDealers] = useState(false);
  const [valuedealer, setValueDealer] = useState('');

  const [searchLoading, setSearchLoading] = useState(false);
  const [nextDealer, setNextDealer] = useState('')

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `/distributor/salesref/get/bysalesref/${JSON.parse(sessionStorage.getItem('user_details')).id
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
        setData({ ...data, dis_sales_ref: res.data.id });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Cannot fetch data. Please try again');
        setTitle('Error');
        handleOpen();
      });
    axiosInstance
      .get(
        `/dashboard/get/next/visit/`,

        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        console.log('next', res.data);
        setNextDealer(res.data.dealer)
      });
  }, [success, setSuccess]);

  const filterDealers = (e) => {
    setShowDealers(true);
    setSearchLoading(true);
    axiosInstance
      .get(`/dealer/all/search?search=${e.target.value}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSearchLoading(false);

        setDealers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setValueDealer(e.target.value);
  };
  const handleSelectDealer = (e, item) => {
    setValueDealer(item.name);

    setData({
      ...data,
      dealer: item.id,
    });
    setShowDealers(false);
  };
  const handleCheckedOnlyOur = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_only_our: true,
        is_competitor: false,
        is_dealer_not_in: false,
        is_payment_problem: false,
        is_have_our_brands: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_only_our: false,
      });
    }
  };
  const handleCheckedCompetitor = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_competitor: true,
        is_only_our: false,
        is_dealer_not_in: false,
        is_payment_problem: false,
        is_have_our_brands: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_competitor: false,
      });
    }
  };
  const handleCheckeProblem = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_payment_problem: true,
        is_competitor: false,
        is_only_our: false,
        is_dealer_not_in: false,
        is_have_our_brands: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_payment_problem: false,
      });
    }
  };
  const handleCheckedNotIn = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_dealer_not_in: true,
        is_payment_problem: false,
        is_competitor: false,
        is_only_our: false,
        is_have_our_brands: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_dealer_not_in: false,
      });
    }
  };
  const handleCheckedOurBrands = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_have_our_brands: true,
        is_dealer_not_in: false,
        is_payment_problem: false,
        is_competitor: false,
        is_only_our: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_have_our_brands: false,
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(data);
    axiosInstance
      .post(`/not-buy/add/`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Your data added successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Your data cannot saved. Please refresh your page and try again.'
        );
        handleOpen();
      });
  };

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
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Non-Buying Details</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row center">
          <div className="page__pcont__row__col">
            <div className="nextVisit" >
              Next visit : {nextDealer}

            </div>
          </div>
        </div>
        <div className="form">
          <form action="" onSubmit={(e) => handleSave(e)}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select Dealer</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={valuedealer}
                      onChange={(e) => filterDealers(e)}
                    />
                    {searchLoading ? (
                      <div
                        style={{
                          padding: '5px',
                          position: 'absolute',
                          right: 0,
                          top: '-2px',
                          bottom: 0,
                        }}
                      >
                        <SearchSpinner search={true} />
                      </div>
                    ) : (
                      <SearchIcon
                        style={{
                          padding: '5px',
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="searchContent"
                    style={
                      !showDealers ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    <div className="searchContent__row">
                      <div className="searchContent__row__details">
                        <p>Name</p>
                        <p>Address</p>
                      </div>
                    </div>
                    {dealers
                      .filter((item) => {
                        const searchTerm = valuedealer.toLowerCase();
                        const name = item.name.toLowerCase();
                        const address = item.address.toLowerCase();
                        return (
                          (name.includes(searchTerm) && name !== searchTerm) ||
                          (address.includes(searchTerm) &&
                            address !== searchTerm)
                        );
                      })
                      .map((item, i) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => handleSelectDealer(e, item)}
                          key={i}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.name}</p>
                            <p>{item.address}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Reason</div>
                <div className="form__row__col__input aligned">
                  <input
                    type="radio"
                    name="onlyour"
                    checked={data.is_only_our ? true : false}
                    onChange={(e) => handleCheckedOnlyOur(e)}
                  />
                  <label htmlFor="">Have Only Our Goods </label>
                </div>
                <div className="form__row__col__input aligned">
                  <input
                    type="radio"
                    name="competitor"
                    checked={data.is_competitor ? true : false}
                    onChange={(e) => handleCheckedCompetitor(e)}
                  />
                  <label htmlFor="">Have Competitor Goods </label>
                </div>
                <div className="form__row__col__input aligned">
                  <input
                    type="radio"
                    name="payproblem"
                    checked={data.is_payment_problem ? true : false}
                    onChange={(e) => handleCheckeProblem(e)}
                  />
                  <label htmlFor="">Payment Problem </label>
                </div>
                <div className="form__row__col__input aligned">
                  <input
                    type="radio"
                    name="notin"
                    checked={data.is_dealer_not_in ? true : false}
                    onChange={(e) => handleCheckedNotIn(e)}
                  />
                  <label htmlFor="">Dealer Not In </label>
                </div>
                <div className="form__row__col__input aligned">
                  <input
                    type="radio"
                    name="ourbrands"
                    checked={data.is_have_our_brands ? true : false}
                    onChange={(e) => handleCheckedOurBrands(e)}
                  />
                  <label htmlFor=""> Has a Few of Our Brands </label>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotPerchase;
