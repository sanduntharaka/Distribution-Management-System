import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import ProfilePictureUpload from '../../components/edit/ProfilePictureUpload';
import Message from '../../components/message/Message';
const ShowMessage = forwardRef((props, ref) => {
  return (
    <Message
      hide={props.handleClose}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});

const ShowFileUpload = forwardRef((props, ref) => {
  return (
    <ProfilePictureUpload
      user_id={props.user_id}
      ref={ref}
      close={props.close}
    />
  );
});

const Profile = () => {
  const inputRef = useRef(null);
  const saved_details = JSON.parse(sessionStorage.getItem('user_details'));
  const saved_user = JSON.parse(sessionStorage.getItem('user'));
  const [data, setData] = useState({});

  const [pic, setPic] = useState(false);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    axiosInstance
      .get(`/users/get/${saved_details.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData({
          id: res.data.id,
          email: res.data.email,
          full_name: res.data.full_name,
          address: res.data.address,
          designation: res.data.designation,
          dob: res.data.dob,
          company_number: res.data.company_number,
          personal_number: res.data.personal_number,
          home_number: res.data.home_number,
          immediate_contact_person_name: res.data.immediate_contact_person_name,
          immediate_contact_person_number:
            res.data.immediate_contact_person_number,
          terriotory: res.data.terriotory,
          photo: res.data.photo,
        });
      });
  }, []);

  const updateDetails = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/users/edit/${data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setPic(false);
        setResult(true);
        setLoading(false);
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('User data updated successfully');
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);
        setPic(false);
        setResult(true);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'User data cannot update right now. Please check your data again'
        );
        handleOpen();
      });
  };

  const handlePicUpload = () => {
    setResult(false);
    setPic(true);
    handleOpen();
  };

  const handleShowTerritory = (e) => {
    e.preventDefault();
  }
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
      {result ? (
        <Modal open={open} onClose={handleClose}>
          <ShowMessage
            ref={inputRef}
            handleClose={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        </Modal>
      ) : pic ? (
        <Modal open={open} onClose={handleClose}>
          <ShowFileUpload
            ref={inputRef}
            user_id={data.id}
            close={handleClose}
          />
        </Modal>
      ) : (
        ''
      )}

      <div className="page__title">
        <p>User Profile</p>
      </div>
      <div className="page__pcont">
        <div className="profile_container">
          <div className="section_one">
            <div className="form">
              <form action="">
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Full Name</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type name here"
                        value={
                          data.full_name !== undefined ? data.full_name : ''
                        }
                        onChange={(e) =>
                          setData({ ...data, full_name: e.target.value })
                        }
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
                        placeholder="Type email here"
                        value={data.email !== undefined ? data.email : ''}
                        disabled
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
                        placeholder="Type address here"
                        value={data.address !== undefined ? data.address : ''}
                        onChange={(e) =>
                          setData({ ...data, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Designation</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type designation here"
                        value={
                          data.designation !== undefined ? data.designation : ''
                        }
                        onChange={(e) =>
                          setData({ ...data, designation: e.target.value })
                        }
                        disabled
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
                        placeholder="Type name here"
                        value={data.dob !== undefined ? data.dob : ''}
                        onChange={(e) =>
                          setData({ ...data, dob: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form__row__col dontdisp"></div>
                </div>

                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Contacts</div>

                    <div className="specialColumn">
                      <div
                        className="form__row__col__input"
                        style={{ flex: 1 }}
                      >
                        <div className="form__row__col__label" style={{ fontSize: 12 }}>Company</div>
                        <input
                          type="tel"
                          placeholder="Type company number"
                          value={
                            data.company_number !== undefined
                              ? data.company_number
                              : ''
                          }
                          onChange={(e) =>
                            setData({ ...data, company_number: e.target.value })
                          }
                        />
                      </div>

                      <div
                        className="form__row__col__input"
                        style={{ flex: 1 }}
                      >
                        <div className="form__row__col__label" style={{ fontSize: 12 }}>Personal</div>
                        <input
                          type="tel"
                          placeholder="Type personal number"
                          value={
                            data.personal_number !== undefined
                              ? data.personal_number
                              : ''
                          }
                          onChange={(e) =>
                            setData({
                              ...data,
                              personal_number: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div
                        className="form__row__col__input"
                        style={{ flex: 1 }}
                      >
                        <div className="form__row__col__label" style={{ fontSize: 12 }}>Home</div>
                        <input
                          type="tel"
                          placeholder="Type home number"
                          value={
                            data.home_number !== undefined
                              ? data.home_number
                              : ''
                          }
                          onChange={(e) =>
                            setData({ ...data, home_number: e.target.value })
                          }
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
                        placeholder="Type here"
                        value={
                          data.immediate_contact_person_name !== undefined
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
                      Immediate Contact Person Number
                    </div>
                    <div className="form__row__col__input">
                      <input
                        type="tel"
                        placeholder="Type here"
                        value={
                          data.immediate_contact_person_number !== undefined
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
                    <div className="form__row__col__label">Territory</div>
                    <div className="form__row__col__input">
                      <button className='addBtn' onClick={(e) => handleShowTerritory(e)}>Show My Territory</button>
                    </div>
                  </div>
                  <div className="form__row__col dontdisp"></div>
                </div>

                <div className="form__btn">
                  <div className="form__btn__container">
                    <button
                      className="btnEdit"
                      onClick={(e) => updateDetails(e)}
                    >
                      save
                    </button>
                    <button className="btnSave">reset password</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="section_two">
            <div className="photo">
              <img src={data.photo} alt="" />
            </div>
            <div className="button">
              <button className="btnEdit" onClick={handlePicUpload}>
                Upload New Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
