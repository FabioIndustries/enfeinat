import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CJumbotron,
  CLink,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CFormGroup,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCandidate, getCandidates } from "../../actions/candidates";
import NewCandidatureModal from "../Candidates/NewCandidatureModal";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { createConversation } from "../../actions/conversations";

const initialState = {
  keywords: "",
  availability: "any",
  exp: 0,
  expType: "years",
};

const Candidates = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const stateCandidates = useSelector((state) => state.candidates);
  const conversations = useSelector((state) => state.conversations);
  const [showEditCandidatureModal, setShowEditCandidatureModal] = useState(false);
  const [currentEditingCandidature, setCurrentEditingCandidature] = useState(null);
  const [searchFormData, setSearchFormData] = useState(initialState);
  const [displayCandidatures, setDisplayCandidatures] = useState([]);

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

  const handleSearchReset = () => {
    setSearchFormData(initialState);
  };

  const handleEdit = (candidature) => {
    setCurrentEditingCandidature(candidature);
    setShowEditCandidatureModal(true);
  };

  const handleTagClick = (tag) => {
    setSearchFormData({ ...searchFormData, keywords: tag });
  };

  const handleAvailabilityClick = (availability) => {
    setSearchFormData({ ...searchFormData, availability: availability });
  };

  const handleExperienceClick = (expMonths) => {
    if (expMonths >= 12) {
      setSearchFormData({ ...searchFormData, exp: expMonths / 12, expType: "years" });
    } else {
      setSearchFormData({ ...searchFormData, exp: expMonths, expType: "months" });
    }
  };

  const handleApplyClick = async (candidate) => {

    for (let conversation of conversations) {
      if (conversation.documentType === 1 && conversation.relatedDocumentId === candidate._id) {
        return history.push(`/messaging/${conversation._id}`);
      }
    }

    const newConversation = {
      relatedDocumentId: candidate._id,
      documentType: 1,
      initiatorId: auth.result._id,
      recipientId: candidate.creatorId,
      active: true,
    };
    const res = await dispatch(createConversation(newConversation));
    history.push(`/messaging/${res._id}`);
  }

  useEffect(() => {
    let currentCandidates = [...stateCandidates];

    // Keyword handle
    if (searchFormData.keywords.length > 0) {
      const keywordsArray = searchFormData.keywords.split(" ");
      currentCandidates = currentCandidates.filter((candidate) => {
        for (let keyword of keywordsArray) {
          const lowerCaseKeyword = keyword.toLowerCase();
          const lowerCaseTags = candidate.tags.map((tag) => tag.toLowerCase());
          if (lowerCaseKeyword === "") continue;
          if (candidate.title.toLowerCase().includes(lowerCaseKeyword) || candidate.description.toLowerCase().includes(lowerCaseKeyword)) {
            return true;
          }
          for (let tag of lowerCaseTags) {
            if (tag.includes(lowerCaseKeyword)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    // Availability handle
    if (searchFormData.availability !== "any") {
      currentCandidates = currentCandidates.filter((candidate) => {
        if (candidate.availability === searchFormData.availability) {
          return true;
        }
        return false;
      });
    }

    // Experience handle
    if (searchFormData.exp > 0) {
      const expInMonths = searchFormData.expType === "months" ? searchFormData.exp : searchFormData.exp * 12;
      currentCandidates = currentCandidates.filter((candidate) => {
        if (candidate.expMonths >= expInMonths) {
          return true;
        }
        return false;
      });
    }

    setDisplayCandidatures(currentCandidates);
  }, [stateCandidates, searchFormData]);

  const convertExpString = (expMonths) => {
    if (expMonths < 12) {
      if (expMonths === "1") {
        return `Exp. ${expMonths} month`;
      }
      return `Exp. ${expMonths} months`;
    } else {
      let yearsAmount = (expMonths / 12).toFixed(1);
      if (expMonths % 12 === 0) {
        yearsAmount = (expMonths / 12).toFixed(0);
      }

      if (yearsAmount === "1") {
        return `Exp. ${yearsAmount} year`;
      }

      return `Exp. ${yearsAmount} years`;
    }
  };

  const handleSearchChange = (e) => {
    setSearchFormData({ ...searchFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <CJumbotron>
        <h1 className="display-4">Candidates</h1>
        <p className="lead">The best professionals that are looking for a new challenge.</p>

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
            <CLink className="card-header-action" onClick={() => setVisible(!visible)}>
              <CIcon name={visible ? "cil-chevron-top" : "cil-chevron-bottom"} />
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse show={visible}>
          <CCardBody>
            <CForm>
              <CFormGroup row style={{ marginTop: 0, marginBottom: 0 }}>
                <CCol xs="12" lg="12" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-pencil" />
                        &nbsp; Keywords
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" id="keywords" name="keywords" value={searchFormData.keywords} onChange={(e) => handleSearchChange(e)} />
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="4" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-bookmark" />
                        &nbsp; Status
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect custom name="availability" value={searchFormData.availability} onChange={(e) => handleSearchChange(e)}>
                      <option value="any">Any</option>
                      <option value="available">Available</option>
                      <option value="listening-to-offers">Listening to offers</option>
                      <option value="not-available">Not available</option>
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="4" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-clock" />
                        &nbsp; Experience
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="number" id="exp" name="exp" value={searchFormData.exp} onChange={(e) => handleSearchChange(e)} />
                    <CSelect custom name="expType" value={searchFormData.expType} onChange={(e) => handleSearchChange(e)}>
                      <option value="years">years</option>
                      <option value="months">months</option>
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="4" className="mt-2">
                  <CInputGroup>
                    <CButton style={{ width: "100%" }} color="primary" onClick={handleSearchReset}>
                      <CIcon name="cil-filter-x" />
                      <span className="align-middle ml-1">Reset</span>
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCollapse>
      </CCard>

      <CRow>
        {[...displayCandidatures].reverse().map((candidate) => (
          <CCol xs="12" sm="12" lg="12" key={candidate._id}>
            <CCard color="light" accentColor={candidate.creatorId === auth?.result._id ? "green" : ""}>
              <CCardHeader>
                <span className="align-middle">
                  <CIcon name="cil-chevron-right" />
                  <span className="align-middle ml-1">{candidate.title}</span>
                </span>
                <div className="card-header-actions">
                  <CBadge className="align-middle ml-1" color="primary">
                    {candidate.creator[0].userName}
                  </CBadge>{" "}
                  <CBadge className="align-middle ml-1 mr-2" color="info">
                    {moment(candidate.createdAt).format("DD/MM/YYYY")}
                  </CBadge>
                  {candidate.creatorId === auth?.result._id ? (
                    <>
                      <CButton className="align-middle mr-2" shape="pill" color="warning" size="sm" onClick={() => handleEdit(candidate)}>
                        <CIcon name="cil-pencil" />
                        <span className="align-middle ml-1">Edit</span>
                      </CButton>
                      <CButton className="align-middle" shape="pill" color="danger" size="sm" onClick={() => handleDelete(candidate._id)}>
                        <CIcon name="cil-x" />
                        <span className="align-middle ml-1">Delete</span>
                      </CButton>
                    </>
                  ) : (
                    <CButton shape="pill" color="success" size="sm" onClick={(e) => handleApplyClick(candidate)}>
                      <CIcon name="cil-at" />
                      <span className="align-middle ml-1">Contact</span>
                    </CButton>
                  )}
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                <div style={{ padding: 20 }}>
                  {candidate.description}
                  <div>
                    {candidate.tags.map((tag) => (
                      <CBadge key={tag} className="mt-2 mr-2 align-middle" color="dark" onClick={(e) => handleTagClick(tag)} style={{ cursor: "pointer" }}>
                        {tag}
                      </CBadge>
                    ))}
                  </div>
                </div>
                <hr className="m-0" />

                <div style={{ padding: "10px 20px" }}>
                  <CBadge
                    className="my-2 mr-2 p-2 align-middle"
                    color={candidate.availability === "available" ? "success" : candidate.availability === "listening-to-offers" ? "warning" : "danger"}
                    onClick={(e) => handleAvailabilityClick(candidate.availability)}
                    style={{ cursor: "pointer" }}
                  >
                    <CIcon name={candidate.availability === "available" ? "cil-check" : candidate.availability === "listening-to-offers" ? "cil-bookmark" : "cil-x-circle"} />
                    <span className="align-middle ml-1">{convertKeyString(candidate.availability)}</span>
                  </CBadge>

                  <CBadge className="my-2 mr-2 p-2 align-middle" color="turquoise" onClick={(e) => handleExperienceClick(candidate.expMonths)} style={{ cursor: "pointer" }}>
                    <CIcon name="cil-clock" />
                    <span className="align-middle ml-1">{convertExpString(candidate.expMonths)}</span>
                  </CBadge>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
        <NewCandidatureModal visible={showEditCandidatureModal} setVisible={setShowEditCandidatureModal} candidature={currentEditingCandidature} />
      </CRow>
    </>
  );
};

export default Candidates;
