import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Message from "../../components/message/Message";

const Dashboard = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      console.log("not");
      navigate("login/");
    }
  }, []);
  const handleMsgShow = () => {
    setShow(true);
  };
  const handleMsgHide = () => {
    setShow(false);
  };
  return (
    <div>
      <h3>Dashboard</h3>
      <button onClick={handleMsgShow}>show</button>
      <button onClick={handleMsgHide}>hide</button>
      {show ? (
        <Message
          hide={setShow}
          success={false}
          error={true}
          details={false}
          title="Hii..."
          msg="Hello mr user how are you"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;
