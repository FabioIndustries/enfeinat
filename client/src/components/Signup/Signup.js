import CIcon from "@coreui/icons-react";
import { useDispatch } from "react-redux";
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
import { Link, useHistory } from "react-router-dom";
import { signup } from "../../actions/auth";

const initialState = {
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [formData, setFormData] = useState(initialState);
  const [toasts, setToasts] = useState([]);
  const router = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData)).then((response) => {
      if (!response.success) {
        switch (response.error_code) {
          case "existing_user":
            return addToast({
              title: "User already exists",
              message:
                "This email address or this username is already in use, please try another one.",
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
                <h1>Sign up</h1>
                <p className="text-muted">Create your account</p>
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
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <CIcon name="cil-user" />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    type="text"
                    placeholder="Username"
                    autoComplete="Username"
                    name="userName"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <CIcon name="cil-lock-locked" />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    name="password"
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
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    name="confirmPassword"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </CInputGroup>
                <CRow>
                  <CCol xs="6">
                    <CButton type="submit" color="primary" className="px-4">
                      Sign up
                    </CButton>
                  </CCol>
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
                <h2>Login</h2>
                <p>Already have an account? Login instead.</p>
                <Link to="/login">
                  <CButton color="light" className="mt-3" active tabIndex={-1}>
                    Login Now!
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

export default Signup;
