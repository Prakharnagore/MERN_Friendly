import React, { useState } from "react";
import { Formik, Form } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const loginInfos = {
  email: "",
  password: "",
};
const LoginForm = ({ setVisible }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Must be a valid email")
      .max(100),
    password: Yup.string().required("Password is required"),
  });

  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email,
          password,
        }
      );
      setError("");
      setLoading(false);
      setSuccess(data.message);
      const { message, ...rest } = data;
      setTimeout(() => {
        dispatch({ type: "LOGIN", payload: rest });
        Cookies.set("user", JSON.stringify(rest));
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <>
      <div className="login_wrap">
        <div className="login_1">
          <img
            src="../../icons/icon.png"
            alt="Friends Login"
            style={{ width: "100%" }}
          />
          <span>
            Friends helps you connect and share with the people in your life.
          </span>
        </div>
        <div className="login_2">
          <div className="login_2_wrap">
            <Formik
              enableReinitialize
              initialValues={{ email, password }}
              validationSchema={loginValidation}
              onSubmit={() => {
                loginSubmit();
              }}
            >
              {(formik) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="email"
                    placeholder="Email address or Phone number "
                    onChange={handleLoginChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleLoginChange}
                    bottom
                  />
                  <button type="submit" className="blue_btn">
                    Login
                  </button>
                  <DotLoader color="#1876f2" loading={loading} size={30} />
                  {error && <div className="error_text">{error}</div>}
                  {success && <div className="success_text">{success}</div>}
                </Form>
              )}
            </Formik>
            <Link to="/forgot" className="forgot_password">
              Forgotten Password ?
            </Link>
            <div className="sign_splitter"></div>
            <button className="blue_btn" onClick={() => setVisible(true)}>
              Create Account
            </button>
            {/* open_signup */}
          </div>
          {/* <Link to="/" className="sign_extra">
              <b>Create a Page for celebrity or business</b>
            </Link> */}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
