import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { CHeader, CToggler, CHeaderBrand, CSubheader, CBreadcrumbRouter, CButton, CToaster, CToast, CToastHeader, CToastBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";

import routes from "../../routes";
import NewOfferModal from "../Offers/NewOfferModal";
import NewCandidatureModal from "../Candidates/NewCandidatureModal";
import { connectSocket } from "../../actions/sockets";

export const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  dispatch(connectSocket());

  // Redux stuff
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const auth = useSelector((state) => state.auth);
  const alerts = useSelector((state) => state.alerts);

  // Local state stuff
  const [showAddOfferButton, setShowAddOfferButton] = useState(false);
  const [showAddCandidatureButton, setShowAddCandidatureButton] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddCandidatureModal, setShowAddCandidatureModal] = useState(false);

  // Location effect
  useEffect(() => {
    // Everything to false to start
    setShowAddOfferButton(false);
    setShowAddCandidatureButton(false);

    if (auth) {
      if (location.pathname === "/offers") {
        setShowAddOfferButton(true);
        return;
      }

      if (location.pathname === "/candidates") {
        setShowAddCandidatureButton(true);
        return;
      }
    }
  }, [location, auth]);

  useEffect(() => {
    if (alerts === '') return;
    if (location.pathname.includes("/messaging")) return;
    setToasts([...toasts,
      {
        position: "top-center",
        autohide: 3000,
        title: "Notification",
        message: alerts,
      },
    ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  /* const toggleSidebar = () => {
        const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
        dispatch({ type: 'SIDEBAR_SET', payload: val })
    } */

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow) ? true : "responsive";
    dispatch({ type: "SIDEBAR_SET", payload: val });
  };

  let toasters = (() => {
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || [];
      toasters[toast.position].push(toast);
      return toasters;
    }, {});
  })();

  return (
    <>
      <CHeader withSubheader>
        <CToggler inHeader className="ml-md-3 d-lg-none" onClick={toggleSidebarMobile} />
        {/* <CToggler
                inHeader
                className="ml-3 d-md-down-none"
                onClick={toggleSidebar}
            /> */}
        <CHeaderBrand className="mx-auto d-lg-none" to="/">
          <CIcon name="logo" height="48" alt="Logo" />
        </CHeaderBrand>

        {/* <CHeaderNav className="d-md-down-none mr-auto px-3">

                <CHeaderNavItem className="px-3" >
                    <CBadge className="p-2" color="primary">
                        <CIcon name="cil-user" alt="user" />&nbsp; +1000 usuaris registrats
                    </CBadge>
                </CHeaderNavItem>

                <CHeaderNavItem className="px-3" ></CHeaderNavItem>
                <CBadge className="p-2" color="custom-color">
                    <CIcon name="cil-paperclip" alt="paperclip" />&nbsp; +500 ofertes de feina
                </CBadge>
            </CHeaderNav> */}

        <CSubheader className="px-3 justify-content-between">
          <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />
          <div className="mfe-2 c-subheader-nav">
            {showAddOfferButton && (
              <CButton onClick={() => setShowAddOfferModal(true)} color="success" size="sm">
                New offer
              </CButton>
            )}
            {showAddCandidatureButton && (
              <CButton onClick={() => setShowAddCandidatureModal(true)} color="success" size="sm">
                New candidature
              </CButton>
            )}
          </div>
        </CSubheader>
      </CHeader>
      <NewOfferModal visible={showAddOfferModal} setVisible={setShowAddOfferModal} />
      <NewCandidatureModal visible={showAddCandidatureModal} setVisible={setShowAddCandidatureModal} />
      {Object.keys(toasters).map((toasterKey) => (
        <CToaster position={toasterKey} key={"toaster" + toasterKey}>
          {toasters[toasterKey].map((toast, key) => {
            return (
              <CToast key={"toast" + key} show={true} autohide={toast.autohide} fade={toast.fade} color="primary">
                <CToastHeader closeButton={toast.closeButton}>{toast.title}</CToastHeader>
                <CToastBody>{toast.message}</CToastBody>
              </CToast>
            );
          })}
        </CToaster>
      ))}
    </>
  );
};
