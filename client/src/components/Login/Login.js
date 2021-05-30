import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToaster,
  CToastHeader,
} from "@coreui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { login } from "../../actions/auth";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [toasts, setToasts] = useState([]);
  const router = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((response) => {
      if (!response.success) {
        switch (response.error_code) {
          case "user_not_found":
            return addToast({
              title: "User not found",
              message:
                "This email address is not associated to a user account.",
            });
          case "invalid_login":
            return addToast({
              title: "Invalid login",
              message:
                "The email and password combination is wrong. Please try again.",
            });
          default:
            return addToast({
              title: "Something went wrong",
              message: "Please try again later",
            });
        }
      }

      return router.push("/");
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addToast = ({ title, message }) => {
    setToasts([
      ...toasts,
      {
        position: "top-center",
        autohide: 3000,
        title: title,
        message: message,
      },
    ]);
  };

  let toasters = (() => {
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || [];
      toasters[toast.position].push(toast);
      return toasters;
    }, {});
  })();

  return (
    <CRow className="justify-content-center">
      <CCol md="12">
        <CCardGroup>
          <CCard className="p-4">
            <CCardBody>
              <CForm onSubmit={(e) => handleSubmit(e)}>
                <h1>Login</h1>
                <p className="text-muted">Sign In to your account</p>
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>@</CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    name="email"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <CIcon name="cil-lock-locked" />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    type="password"
                    placeholder="Password"
                    autoComplete="password"
                    name="password"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </CInputGroup>
                <CRow>
                  <CCol xs="6">
                    <CButton type="submit" color="primary" className="px-4">
                      Login
                    </CButton>
                  </CCol>
                  {/* <CCol xs="6" className="text-right">
                    <CButton color="link" className="px-0">
                      Forgot password?
                    </CButton>
                  </CCol> */}
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
            className="text-white bg-primary py-5 d-md-down-none"
            style={{ width: "44%" }}
          >
            <CCardBody className="text-center">
              <div>
                <h2>Sign up</h2>
                <p>Need to create an account first?</p>
                <Link to="/signup">
                  <CButton color="light" className="mt-3" active tabIndex={-1}>
                    Register Now!
                  </CButton>
                </Link>
              </div>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>

      {Object.keys(toasters).map((toasterKey) => (
        <CToaster position={toasterKey} key={"toaster" + toasterKey}>
          {toasters[toasterKey].map((toast, key) => {
            return (
              <CToast
                key={"toast" + key}
                show={true}
                autohide={toast.autohide}
                fade={toast.fade}
                color="danger"
              >
                <CToastHeader closeButton={toast.closeButton}>
                  {toast.title}
                </CToastHeader>
                <CToastBody>{toast.message}</CToastBody>
              </CToast>
            );
          })}
        </CToaster>
      ))}
    </CRow>
  );
};

export default Login;
