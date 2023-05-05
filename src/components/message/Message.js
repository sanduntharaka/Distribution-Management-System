import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegHandPointUp,
} from 'react-icons/fa';

const Message = (props) => {
  //this is message component
  //to open this you shoud define this in following steps
  //  {show ? (
  //     <Message
  //     hide={setShow}
  //     success={false}
  //     error={true}
  //     title="Hii..."
  //     msg="Hello mr user how are you"
  //   />
  // ) : (
  //   ""
  // )}
  //
  const handleClick = () => {
    props.hide(false);
  };
  return (
    <div className="msg" onClick={handleClick}>
      <div className="msg__content">
        <div className="msg__content__icon">
          {props.success ? (
            <FaRegThumbsUp color="green" />
          ) : props.error ? (
            <FaRegThumbsDown color="red" />
          ) : props.details ? (
            <FaRegHandPointUp color="blue" />
          ) : (
            ''
          )}
        </div>
        <div className="msg__content__close">
          <CloseIcon onClick={handleClick} />
        </div>

        <div className="msg__content__title">{props.title}</div>
        <div className="msg__content__details">{props.msg}</div>
      </div>
    </div>
  );
};

export default Message;
