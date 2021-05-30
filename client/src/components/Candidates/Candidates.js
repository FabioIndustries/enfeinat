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
import { deleteCandidate, getCandidates } from "../../actions/candidates";

const Candidates = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const stateCandidates = useSelector((state) => state.candidates);
  
  useEffect(() => {
    dispatch(getCandidates());
  }, [dispatch]);
  const [visible, setVisible] = useState(true);

  const convertKeyString = (str) => {
    let finalString = str.replace("-", " ");
    finalString = finalString.charAt(0).toUpperCase() + finalString.slice(1);
    return finalString;
  };

  const handleDelete = (candidateId) => {
    dispatch(deleteCandidate(candidateId));
  };

  const convertExpString = (expMonths) => {
    if (expMonths < 12) {
      return `Exp. ${expMonths} months`;
    } else {
      const yearsAmount = (expMonths / 12).toFixed(1);
      return `Exp. ${yearsAmount} years`;
    }
  };

  return (
    <>
      <CJumbotron>
        <h1 className="display-4">Candidates</h1>
        <p className="lead">
          The best professionals that are looking for a new challenge.
        </p>

        <div>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="success">
            <CIcon name="cil-check" />
            <span className="align-middle">&nbsp; Available</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="warning">
            <CIcon name="cil-bookmark" />
            <span className="align-middle">&nbsp; Listening to Offers</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="danger">
            <CIcon name="cil-x-circle" />
            <span className="align-middle">&nbsp; Not available</span>
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
        {[...stateCandidates].reverse().map((candidate) => (
          <CCol xs="12" sm="12" lg="12" key={candidate._id}>
            <CCard color="gradient-light">
              <CCardHeader>
                <span className="align-middle">
                  <CIcon name="cil-chevron-right" />
                  <span className="align-middle ml-1">{candidate.title}</span>
                </span>
                <div className="card-header-actions">
                {candidate.creatorId === auth?.result._id ? (
                    <CButton
                      className="align-middle"
                      shape="pill"
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(candidate._id)}
                    >
                      <CIcon name="cil-x" />
                      <span className="align-middle ml-1">Delete</span>
                    </CButton>
                  ) : (
                    <CButton shape="pill" color="success" size="sm">
                      Contact
                    </CButton>
                  )}
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                <div style={{ padding: 20 }}>
                  {candidate.description}
                  <div>
                    {candidate.tags.map((tag) => (
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
                    color={candidate.availability === 'available' ? 'success' : candidate.availability === 'listening-to-offers' ? 'warning' : 'danger' }
                  >
                    <CIcon name={candidate.availability === 'available' ? 'cil-check' : candidate.availability === 'listening-to-offers' ? 'cil-bookmark' : 'cil-x-circle' } />
                    <span className="align-middle ml-1">
                      {convertKeyString(candidate.availability)}
                    </span>
                  </CBadge>

                  <CBadge
                    className="my-2 mr-2 p-2 align-middle"
                    color="turquoise"
                  >
                    <CIcon name="cil-clock" />
                    <span className="align-middle ml-1">
                      {convertExpString(candidate.expMonths)}
                    </span>
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

export default Candidates;
