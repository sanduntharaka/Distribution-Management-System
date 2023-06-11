import Alert from '@mui/material/Alert';
const RequsetStatus = ({
  error,
  loading,
  success,
  setSuccess,
  setError,
  successMsg,
  errorMsg,
  timeout,
}) => {
  if (timeout) {
    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 2000);
  }
  return (
    <div>
      {loading ? (
        <Alert severity="success">
          <div>Loading...</div>
        </Alert>
      ) : error ? (
        <Alert severity="error">
          <div>{errorMsg}</div>
        </Alert>
      ) : success ? (
        <Alert severity="success">
          <div>{successMsg}</div>
        </Alert>
      ) : (
        ''
      )}
    </div>
  );
};

export default RequsetStatus;
