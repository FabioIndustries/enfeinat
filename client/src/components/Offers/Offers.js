import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CJumbotron,
  CLink,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOffer, getOffers } from "../../actions/offers";
import moment from "moment";

const Offers = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const stateOffers = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);
  const [visible, setVisible] = useState(true);

  const convertKeyString = (str) => {
    let finalString = str.replace("-", " ");
    finalString = finalString.charAt(0).toUpperCase() + finalString.slice(1);
    return finalString;
  };

  const handleDelete = (offerId) => {
    dispatch(deleteOffer(offerId));
  };

  return (
    <>
      <CJumbotron>
        <h1 className="display-4">Offers</h1>
        <p className="lead">Find the best job offers in the Andorran market.</p>

        <div>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="success">
            <CIcon name="cil-money" />
            <span className="align-middle">&nbsp; Salary in €</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="info">
            <CIcon name="cil-clock" />
            <span className="align-middle">&nbsp; Full time contract</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="turquoise">
            <CIcon name="cil-description" />
            <span className="align-middle">
              &nbsp; Residence permit / passport not required
            </span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="danger">
            <CIcon name="cil-description" />
            <span className="align-middle">
              &nbsp; Residence permit / passport required
            </span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="gold">
            <CIcon name="cil-location-pin" />
            <span className="align-middle">&nbsp; Location</span>
          </CBadge>
        </div>
      </CJumbotron>

      <CCard>
        <CCardHeader>
          <CIcon name="cil-magnifying-glass" />
          &nbsp; Search
          <div className="card-header-actions">
            <CLink className="card-header-action">
              <CIcon name="cil-settings" />
            </CLink>
            <CLink
              className="card-header-action"
              onClick={() => setVisible(!visible)}
            >
              <CIcon
                name={visible ? "cil-chevron-top" : "cil-chevron-bottom"}
              />
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse show={visible}>
          <CCardBody>Work in progress!</CCardBody>
        </CCollapse>
      </CCard>

      <CRow>
        {[...stateOffers].reverse().map((offer) => (
          <CCol key={offer._id} xs="12" sm="12" lg="12">
            <CCard color="gradient-light">
              <CCardHeader>
                <span className="align-middle">
                  <CIcon name="cil-chevron-right" />
                  <span className="align-middle ml-1">{offer.title}</span>
                  <i className="align-middle ml-1" color="dark">by {offer.creator[0].userName} on the {moment(offer.createdAt).format('DD/MM/YYYY')}</i>
                </span>
                <div className="card-header-actions">
                  {offer.creatorId === auth?.result._id ? (
                    <CButton
                      className="align-middle"
                      shape="pill"
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(offer._id)}
                    >
                      <CIcon name="cil-x" />
                      <span className="align-middle ml-1">Delete</span>
                    </CButton>
                  ) : (
                    <CButton shape="pill" color="success" size="sm">
                      Apply
                    </CButton>
                  )}
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                <div style={{ padding: 20 }}>
                  {offer.description}
                  <div>
                    {offer.tags.map((tag) => (
                      <CBadge
                        key={tag}
                        className="mt-2 mr-2 align-middle"
                        color="dark"
                      >
                        {tag}
                      </CBadge>
                    ))}
                  </div>
                </div>
                <hr className="m-0" />
                <div style={{ padding: "10px 20px" }}>
                  <CBadge
                    className="my-2 mr-2 p-2 align-middle"
                    color="success"
                  >
                    <CIcon name="cil-money" />
                    <span className="align-middle ml-1">
                      {offer.salary.min}€ - {offer.salary.max}€
                    </span>
                  </CBadge>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color="info">
                    <CIcon name="cil-clock" />
                    <span className="align-middle ml-1">
                      {convertKeyString(offer.contractType)}
                    </span>
                  </CBadge>
                  <CBadge
                    className="my-2 mr-2 p-2 align-middle"
                    color={offer.permitRequired ? "danger" : "turquoise"}
                  >
                    <CIcon name="cil-description" />
                    <span className="align-middle ml-1">
                      {offer.permitRequired ? "Required" : "Not required"}
                    </span>
                  </CBadge>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color="gold">
                    <CIcon name="cil-location-pin" />
                    <span className="align-middle ml-1">{offer.location}</span>
                  </CBadge>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
};

export default Offers;
