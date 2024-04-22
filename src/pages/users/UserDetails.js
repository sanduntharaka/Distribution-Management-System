import React, { useState, forwardRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';

import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import {
  IoIosAddCircle, IoMdRemoveCircle
} from 'react-icons/io';


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
const UserDetails = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [loading, setLoading] = useState(false);

  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    user:
      sessionStorage.getItem('new_user') !== undefined &&
        sessionStorage.getItem('new_user')
        ? sessionStorage.getItem('new_user')
        : '',
    full_name: '',
    address: '',
    nic: '',
    email: '',
    designation:
      sessionStorage.getItem('new_user_designation') !== undefined &&
        sessionStorage.getItem('new_user_designation')
        ? sessionStorage.getItem('new_user_designation')
        : '',
    dob: '',
    company_number: '',
    personal_number: '',
    home_number: '',
    immediate_contact_person_name: '',
    immediate_contact_person_number: '',
    vat_no: '',
  });
  const [users, setUsers] = useState([]);

  const [terriotories, setTerriotories] = useState([])

  const [codeExist, setCodeExist] = useState(null)
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/users/all/users/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);

  const checkCodeExist = (code) => {

  }

  const handleTerriotory = () => {
    setTerriotories([...terriotories, {
      terriotory_name: '',
      code: '',
      exist: null
    }])
  }

  const handleTypeTerriotory = (e, i) => {
    const { name, value } = e.target;

    if (name === 'code' && value.length > 1) {
      axiosInstance
        .get(`/users/search/terriotory/${value}`, {
          headers: {
            Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          const onChangeVal = [...terriotories];
          onChangeVal[i][name] = value;

          if (res.data.exist) {
            onChangeVal[i]['exist'] = true;
          } else {
            onChangeVal[i]['exist'] = false;
          }

          setTerriotories(onChangeVal);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const onChangeVal = [...terriotories];
      onChangeVal[i][name] = value;
      setTerriotories(onChangeVal);
    }
  };




  const handleRemoveTerriotory = (i) => {
    const updatedTerriotories = [...terriotories];
    updatedTerriotories.splice(i, 1);
    setTerriotories(updatedTerriotories);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post('/users/create/', { data: data, terriotories: terriotories }, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        handleOpen();
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg(
          'User created successfully. Please add this user to proper relation.'
        );
        sessionStorage.removeItem('new_user_email');
        setData({ ...data, user: '' });
      })
      .catch((err) => {
        setLoading(false);

        let error = JSON.parse(err.request.response);
        console.log(typeof error);
        console.log(error);

        handleOpen();
        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Cannot save data. Please check again.');
        if (error.errors.nic) {
          setMsg(`${msg} ${error.errors.nic}`);
        }
      });
  };
  const hanldeClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      full_name: '',
      address: '',
      email: '',
      nic: '',
      designation: '',
      dob: '',
      company_number: '',
      personal_number: '',
      home_number: '',
      immediate_contact_person_name: '',
      immediate_contact_person_number: '',
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
        <ShowMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>User Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select User Account</div>
                <div className="form__row__col__input">
                  {/* <input
                    type="text"
                    placeholder="Type name here"
                    value={data.full_name ? data.full_name : ''}
                    onChange={(e) =>
                      setData({ ...data, full_name: e.target.value })
                    }
                    required
                  /> */}
                  <select
                    defaultValue={'null'}
                    name=""
                    id=""
                    value={data.user ? data.user : ''}
                    onChange={(e) => setData({ ...data, user: e.target.value })}
                  >
                    <option value="null">Select User</option>
                    {users.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.user_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Name with Initials</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type Name Here"
                    value={data.full_name ? data.full_name : ''}
                    onChange={(e) =>
                      setData({ ...data, full_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div
                  className="form__row__col__label"
                  style={{ display: 'flex', gap: 5 }}
                >
                  Email
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type Email Here"
                    value={data.email ? data.email : ''}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Address</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type Address Here"
                    value={data.address ? data.address : ''}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">NIC</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder=" Type NIC Number Here"
                    value={data.nic ? data.nic : ''}
                    onChange={(e) => setData({ ...data, nic: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">VAT Invoice Number(Optional)</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder=" Type VAT Number Here"
                    value={data.vat_no ? data.vat_no : ''}
                    onChange={(e) => setData({ ...data, vat_no: e.target.value })}

                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Date of Birth</div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    placeholder="Type dob Here"
                    value={data.dob ? data.dob : ''}
                    onChange={(e) => setData({ ...data, dob: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Designation</div>
                <div className="form__row__col__input">
                  <select
                    value={data.designation ? data.designation : ''}
                    onChange={(e) =>
                      setData({ ...data, designation: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Designation</option>

                    {user.is_company || user.is_superuser ? (
                      <>
                        <option value="Company">Company</option>
                        <option value="Executive">Excecutive</option>
                      </>
                    ) : (
                      ''
                    )}
                    {user.is_excecutive || user.is_company || user.is_superuser ? (
                      <>
                        <option value="Manager">Manager</option>
                      </>
                    ) : (
                      ''
                    )}
                    {user.is_excecutive ||
                      user.is_company ||
                      user.is_manager || user.is_superuser ? (
                      <>
                        <option value="Distributor">Distributor</option>
                      </>
                    ) : (
                      ''
                    )}

                    <option value="Sales Rep">Sales Rep</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Contact Numbers</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type Company Number"
                      value={data.company_number ? data.company_number : ''}
                      onChange={(e) =>
                        setData({ ...data, company_number: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type Personal Number"
                      value={data.personal_number ? data.personal_number : ''}
                      onChange={(e) =>
                        setData({ ...data, personal_number: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type Home Number"
                      value={data.home_number ? data.home_number : ''}
                      onChange={(e) =>
                        setData({ ...data, home_number: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Immediate Contact Person Name
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type Here"
                    value={
                      data.immediate_contact_person_name
                        ? data.immediate_contact_person_name
                        : ''
                    }
                    onChange={(e) =>
                      setData({
                        ...data,
                        immediate_contact_person_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Immediate contact Person Number
                </div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="Type Here"
                    value={
                      data.immediate_contact_person_number
                        ? data.immediate_contact_person_number
                        : ''
                    }
                    onChange={(e) =>
                      setData({
                        ...data,
                        immediate_contact_person_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label" style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "center" }}> Add Territory With Invoice Code  <IoIosAddCircle className='btn' color='blue' size={25} onClick={handleTerriotory} /> </div>

                {terriotories.map((item, i) => (
                  <div className="input" style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "center" }} key={i}>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type Territory Here"
                        name='terriotory_name'
                        value={item.terriotory_name}
                        onChange={(e) => handleTypeTerriotory(e, i)}
                      />
                    </div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type Code Here"
                        name='code'

                        value={item.code}
                        onChange={(e) => handleTypeTerriotory(e, i)}
                      />
                    </div>
                    <IoMdRemoveCircle color='red' size={25} onClick={() => handleRemoveTerriotory(i)} />
                    {
                      item.exist ? <div style={{ color: 'red' }}>Exist</div> : item.exist === null ? "" : <div style={{ color: 'green' }}>Correct</div>
                    }

                  </div>
                ))}

              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
                <button className="btnSave" onClick={(e) => hanldeClear(e)}>
                  clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default UserDetails;
