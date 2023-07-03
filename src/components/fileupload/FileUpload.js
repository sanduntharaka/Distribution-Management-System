import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../loadingSpinner/Spinner';
const FileUpload = (props) => {
  const [prossesing, setProssesing] = useState(false);
  const [res, setRes] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileDownload = (rese) => {
    console.log(rese);
    const fileData = JSON.stringify(rese);
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'result.txt';
    link.href = url;
    link.click();
  };
  const handleUpload = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('user', JSON.parse(sessionStorage.getItem('user')).id);
    if (props.ditributor) {
      formData.append('inventory', props.inventory);
    }
    axiosInstance
      .post(props.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
        timeout: 50000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          console.log(percentCompleted);
          setProssesing(true);
        },
      })
      .then((response) => {
        setResponse(response.data);
        setRes(true);
        setLoading(false);
        setProssesing(false);
        setError(false);
        setSuccess(true);
        fileDownload(response.data);
      })
      .catch((error) => {
        setResponse(error);
        setRes(true);
        setLoading(false);
        setProssesing(false);
        setSuccess(false);
        setError(true);
        if (error.response.data) {
          fileDownload(error.response.data);
        }

        console.log(error);
      });
  };
  const handleClear = (e) => {
    e.preventDefault();
    acceptedFiles.removeAll();
    setProgress(0);
    setProssesing(false);
    setError(false);
    setSuccess(false);
  };

  const handleClose = (e) => {
    e.preventDefault();
    props.close();
  };
  return (
    <div className="fileupload">
      <div className="fileupload__content">
        <section className="container">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>
              Drag 'n' drop a file here, or click to select file.Please add
              Excel file in given format
            </p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
          <div className="buttons">
            <button className="btnEdit " onClick={(e) => handleUpload(e)}>
              Submit
            </button>
            <button className="btnSave" onClick={(e) => handleClear(e)}>
              Clear
            </button>
            <button className="addBtn" onClick={(e) => handleClose(e)}>
              Close
            </button>
          </div>
          <div className="file-status">
            <div className="progres">
              {progress === 100 && success ? (
                <p className="psuccess">Your file successfully uploaded</p>
              ) : error ? (
                <p className="error">Try again...</p>
              ) : (
                ''
              )}
            </div>
            <div className="processing">
              {prossesing ? <p>Processing... wait.</p> : ''}
            </div>

            <div className="loading">
              {loading ? <Spinner detail={true} /> : ''}
            </div>
            <div className="result">
              {loading === false && res ? (
                <ul>
                  <li>{response.added_count} were added</li>
                  {response.errors_count > 0 ? (
                    <li>
                      {response.errors_count} has some mistakes. please check
                      again.
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              ) : (
                ''
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FileUpload;
