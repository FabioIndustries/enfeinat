import React from "react";
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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateUser } from "../../actions/auth";

const Settings = () => {
  const userData = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: userData.result.email,
    userName: userData.result.userName,
    password: "",
  });

  const [toasts, setToasts] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email.trim().length < 3) {
      return addToast({
        title: "Email too short",
        message: "The email has to be atleast 3 characters long.",
        color: "danger",
      });
    }

    if (formData.userName.trim().length < 3) {
      return addToast({
        title: "Username too short",
        message: "The username has to be atleast 3 characters long.",
        color: "danger",
      });
    }

    dispatch(updateUser(formData)).then((response) => {
      if (!response.success) {
        switch (response.error_code) {
          case "username_in_use":
            return addToast({
              title: "User not found",
              message: "That username is already being used.",
              color: "danger",
            });
          case "email_in_use":
            return addToast({
              title: "Invalid login",
              message: "That email is already being used.",
              color: "danger",
            });
          default:
            return addToast({
              title: "Something went wrong",
              message: "Please try again later",
              color: "danger",
            });
        }
      }

      return addToast({
        title: "Success",
        message: "Account updated successfully",
        color: "success",
      });
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addToast = ({ title, message, color }) => {
    setToasts([
      ...toasts,
      {
        position: "top-center",
        autohide: 3000,
        title: title,
        message: message,
        color: color
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
                <h1>Settings</h1>
                <p className="text-muted">Edit your account settings</p>
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>@</CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput value={formData.email} type="email" placeholder="New email" name="email" required onChange={(e) => handleChange(e)} />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <CIcon name="cil-user" />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput value={formData.userName} type="text" placeholder="New username" name="userName" required onChange={(e) => handleChange(e)} />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <CIcon name="cil-lock-locked" />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput value={formData.password} type="password" placeholder="New password" name="password" onChange={(e) => handleChange(e)} />
                </CInputGroup>
                <CRow>
                  <CCol xs="6">
                    <CButton type="submit" color="primary" className="px-4">
                      Save
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
          <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: "44%" }}>
            <CCardBody className="text-center">
              <div>
                <h2>Chose a good Username!</h2>
                <p>That's the only way other users will be able to see you!</p>
                <div className="mt-5">
                  <Link to="/offers">
                    <CButton color="light" active tabIndex={-1}>
                      Offers
                    </CButton>
                  </Link>
                  <span className="mx-2">|</span>
                  <Link to="/candidatures">
                    <CButton color="light" active tabIndex={-1}>
                      Candidatures
                    </CButton>
                  </Link>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>

      {Object.keys(toasters).map((toasterKey) => (
        <CToaster position={toasterKey} key={"toaster" + toasterKey}>
          {toasters[toasterKey].map((toast, key) => {
            return (
              <CToast key={"toast" + key} show={true} autohide={toast.autohide} fade={toast.fade} color={toast.color}>
                <CToastHeader closeButton={toast.closeButton}>{toast.title}</CToastHeader>
                <CToastBody>{toast.message}</CToastBody>
              </CToast>
            );
          })}
        </CToaster>
      ))}
    </CRow>
  );
};

export default Settings;
