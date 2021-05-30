import { CJumbotron } from "@coreui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { logout } from "../../actions/auth";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useHistory();

  setTimeout(() => {
    router.push("/login");
    dispatch(logout());
  }, 3000);

  return (
    <CJumbotron>
      <h1 className="display-3">Logging out</h1>
      <p className="lead">Redirecting in 3 seconds...</p>
    </CJumbotron>
  );
};

export default Logout;
