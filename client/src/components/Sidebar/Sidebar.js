import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import NavItems from "./NavItems";
import decode from "jwt-decode";
import { logout } from "../../actions/auth";
import { useLocation } from "react-router";

const loggedInPages = ["Logout", "Settings", "Messaging"];

const loggedOutPages = ["Login", "Sign up"];

const getUnreadMessagesCount = (messages, auth) => {
  let count = 0;
  for (let message of messages) {
    if (!message.isRead && auth.result._id !== message.creatorId)
    count ++;
  }
  return count;
}

export const Sidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const auth = useSelector((state) => state.auth);
  const general = useSelector((state) => state.general);
  const messages = useSelector((state) => state.messages);
  const location = useLocation();
  const [updatedNavItems, setUpdatedNavItems] = useState(NavItems);

  useEffect(() => {
    let navItems = NavItems;
    navItems = changeNavItemBadge({navItems, name: 'Offers', value: general.offers });
    navItems = changeNavItemBadge({navItems, name: 'Candidates', value: general.candidatures });
    if (auth) {
      navItems = changeNavItemBadge({navItems, name: 'Messaging', value:  getUnreadMessagesCount(messages, auth) });
    }
    if (auth) {
      setUpdatedNavItems(
        navItems.filter((item) => !loggedOutPages.includes(item.name))
      );
    } else {
      setUpdatedNavItems(
        navItems.filter((item) => !loggedInPages.includes(item.name))
      );
    }
  }, [auth, setUpdatedNavItems, general, messages]);

  useEffect(() => {
    if (auth) {
      const decodedToken = decode(auth.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) dispatch(logout());
    }
  }, [auth, location, dispatch]);

  const changeNavItemBadge = ({ navItems, name, value }) => {
    const index = navItems.findIndex((item) => item.name === name);
    navItems[index].badge.text = value;
    return navItems;
  };

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "SIDEBAR_SET", payload: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={updatedNavItems}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};
