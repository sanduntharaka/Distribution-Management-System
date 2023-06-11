import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const ProfilePictureUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', selectedFile);
    axiosInstance
      .put(`/users/upload/image/${props.user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          console.log(percentCompleted);
        },
      })
      .then((response) => {
        setError(false);
        setSuccess(true);
        console.log(response.data);
      })
      .catch((error) => {
        setSuccess(false);
        setError(true);

        console.log(error);
      });
  };
  const handleCancel = () => {
    props.close();
  };
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Upload profile picture</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <input type="file" onChange={handleFileSelect} />
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={(e) => handleSubmit(e)}>
            Save
          </button>
          <button className="addBtn" onClick={handleCancel}>
            close
          </button>
        </div>
        <div className="progress-bar">
          <div className="progrestxt">
            {progress === 100 && success ? (
              <p className="psuccess">Your photo successfully uploaded</p>
            ) : error ? (
              <p className="error">Try again...</p>
            ) : (
              ''
            )}
          </div>
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: `${
                progress < 50 ? 'rgb(254, 199, 48)' : 'rgb(12, 81, 200)'
              }`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
