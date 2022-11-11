import React, { useState } from "react";
import RegisterForm from "../../components/login/RegisterForm";
import Footer from "../../components/login/Footer";
import LoginForm from "../../components/login/LoginForm";
import "./style.css";

const Login = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="login">
      <div className="login_wrapper">
        <LoginForm setVisible={setVisible} />
        {visible && <RegisterForm setVisible={setVisible} />}
        <Footer />
      </div>
    </div>
  );
};

export default Login;
