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
import { deleteOffer, getOffers } from "../../actions/offers";
import moment from "moment";
import NewOfferModal from "../Offers/NewOfferModal";
import { createConversation } from "../../actions/conversations";
import { useHistory } from "react-router-dom";

const initialState = {
  keywords: "",
  location: "",
  salary: 0,
  contractType: "any",
  permitRequired: "any",
};

const Offers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const stateOffers = useSelector((state) => state.offers);
  const conversations = useSelector((state) => state.conversations);
  const [showEditOfferModal, setShowEditOfferModal] = useState(false);
  const [currentEditingOffer, setCurrentEditingOffer] = useState(null);
  const [searchFormData, setSearchFormData] = useState(initialState);
  const [displayOffers, setDisplayOffers] = useState([]);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);
  const [visible, setVisible] = useState(true);

  const convertKeyString = (str) => {
    let finalString = str.replace("-", " ");
    finalString = finalString.charAt(0).toUpperCase() + finalString.slice(1);
    return finalString;
  };

  const handleEdit = (offer) => {
    setCurrentEditingOffer(offer);
    setShowEditOfferModal(true);
  };

  const handleDelete = (offerId) => {
    dispatch(deleteOffer(offerId));
  };

  const handleSearchReset = () => {
    setSearchFormData(initialState);
  };

  const handleTagClick = (tag) => {
    setSearchFormData({ ...searchFormData, keywords: tag});
  }

  const handleSalaryClick = (minSalary) => {
    setSearchFormData({ ...searchFormData, salary: minSalary});
  }

  const handleContractClick = (contractType) => {
    setSearchFormData({ ...searchFormData, contractType: contractType});
  }

  const handlePermitClick = (permitBool) => {
    setSearchFormData({ ...searchFormData, permitRequired: permitBool ? 'required' : 'not-required'});
  }

  const handleLocationClick = (location) => {
    setSearchFormData({ ...searchFormData, location: location});
  }

  const handleApplyClick = async (offer) => {

    for (let conversation of conversations) {
      if (conversation.documentType === 0 && conversation.relatedDocumentId === offer._id) {
        return history.push(`/messaging/${conversation._id}`);
      }
    }

    const newConversation = {
      relatedDocumentId: offer._id,
      documentType: 0,
      initiatorId: auth.result._id,
      recipientId: offer.creatorId,
      active: true,
    };
    const res = await dispatch(createConversation(newConversation));
    history.push(`/messaging/${res._id}`);
  }

  useEffect(() => {
    let currentOffers = [...stateOffers];

    // Keyword handle
    if (searchFormData.keywords.length > 0) {
      const keywordsArray = searchFormData.keywords.split(" ");
      currentOffers = currentOffers.filter((offer) => {
        for (let keyword of keywordsArray) {
          const lowerCaseKeyword = keyword.toLowerCase();
          const lowerCaseTags = offer.tags.map((tag) => tag.toLowerCase());
          if (lowerCaseKeyword === "") continue;
          if (offer.title.toLowerCase().includes(lowerCaseKeyword) || offer.description.toLowerCase().includes(lowerCaseKeyword)) {
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

    // Location handle
    if (searchFormData.location.length > 0) {
      const lowerCaseLocation = searchFormData.location.toLowerCase();
      currentOffers = currentOffers.filter((offer) => {
        if (offer.location.toLowerCase().includes(lowerCaseLocation)) {
          return true;
        }
        return false;
      });
    }

    // Salary handle
    if (searchFormData.salary > 0) {
      currentOffers = currentOffers.filter((offer) => {
        if (searchFormData.salary <= offer.salary.min) {
          return true;
        }
        if (searchFormData.salary >= offer.salary.min && searchFormData.salary <= offer.salary.max) {
          return true;
        }
        return false;
      });
    }

    // Contract handle
    if (searchFormData.contractType !== "any") {
      currentOffers = currentOffers.filter((offer) => {
        if (offer.contractType === searchFormData.contractType) {
          return true;
        }
        return false;
      });
    }

    // Permit handle
    if (searchFormData.permitRequired !== "any") {
      currentOffers = currentOffers.filter((offer) => {
        const permit = searchFormData.permitRequired === "required" ? true : false;
        if (offer.permitRequired === permit) {
          return true;
        }
        return false;
      });
    }

    setDisplayOffers(currentOffers);
  }, [stateOffers, searchFormData]);

  const handleSearchChange = (e) => {
    setSearchFormData({ ...searchFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <CJumbotron>
        <h1 className="display-4">Offers</h1>
        <p className="lead">Find the best job offers in the Andorran market.</p>

        <div>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="success">
            <CIcon name="cil-money" />
            <span className="align-middle">&nbsp; Monthly salary</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="info">
            <CIcon name="cil-clock" />
            <span className="align-middle">&nbsp; Contract type</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="turquoise">
            <CIcon name="cil-description" />
            <span className="align-middle">&nbsp; Residence permit / passport not required</span>
          </CBadge>
          <CBadge className="mt-2 mr-2 p-2 align-middle" color="danger">
            <CIcon name="cil-description" />
            <span className="align-middle">&nbsp; Residence permit / passport required</span>
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
            <CLink className="card-header-action" onClick={() => setVisible(!visible)}>
              <CIcon name={visible ? "cil-chevron-top" : "cil-chevron-bottom"} />
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse show={visible}>
          <CCardBody>
            <CForm>
              <CFormGroup row style={{ marginTop: 0, marginBottom: 0 }}>
                <CCol xs="12" lg="6" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText><CIcon name="cil-pencil" />&nbsp; Keywords</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" id="keywords" name="keywords" value={searchFormData.keywords} onChange={(e) => handleSearchChange(e)} />
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="6" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText><CIcon name="cil-location-pin" />&nbsp; Location</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" id="location" name="location" value={searchFormData.location} onChange={(e) => handleSearchChange(e)} />
                  </CInputGroup>
                </CCol>
              </CFormGroup>
              <CFormGroup row style={{ marginTop: 0 }}>
                <CCol xs="12" lg="4" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText><CIcon name="cil-money" />&nbsp; Salary</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="number" id="salary" name="salary" value={searchFormData.salary} onChange={(e) => handleSearchChange(e)} />
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="3" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText><CIcon name="cil-clock" />&nbsp; Contract type</CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect custom name="contractType" value={searchFormData.contractType} onChange={(e) => handleSearchChange(e)}>
                      <option value="any">Any</option>
                      <option value="full-time">Full time</option>
                      <option value="part-time">Part time</option>
                      <option value="extra-hours">Extra hours</option>
                      <option value="casual">Casual</option>
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="3" className="mt-2">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText><CIcon name="cil-description" />&nbsp; Residence permit</CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect custom name="permitRequired" value={searchFormData.permitRequired} onChange={(e) => handleSearchChange(e)}>
                      <option value="any">Any</option>
                      <option value="required">Required</option>
                      <option value="not-required">Not required</option>
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="12" lg="2" className="mt-2">
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
        {[...displayOffers].reverse().map((offer) => (
          <CCol key={offer._id} xs="12" sm="12" lg="12">
            <CCard color="light" accentColor={offer.creatorId === auth?.result._id ? "green" : ""}>
              <CCardHeader>
                <span className="align-middle">
                  <CIcon name="cil-chevron-right" />
                  <span className="align-middle ml-1">{offer.title}</span>
                </span>
                <div className="card-header-actions">
                  <CBadge className="align-middle ml-1" color="primary">
                    {offer.creator[0].userName}
                  </CBadge>{" "}
                  <CBadge className="align-middle ml-1 mr-2" color="info">
                    {moment(offer.createdAt).format("DD/MM/YYYY")}
                  </CBadge>
                  {offer.creatorId === auth?.result._id ? (
                    <>
                      <CButton className="align-middle mr-2" shape="pill" color="warning" size="sm" onClick={() => handleEdit(offer)}>
                        <CIcon name="cil-pencil" />
                        <span className="align-middle ml-1">Edit</span>
                      </CButton>
                      <CButton className="align-middle" shape="pill" color="danger" size="sm" onClick={() => handleDelete(offer._id)}>
                        <CIcon name="cil-x" />
                        <span className="align-middle ml-1">Delete</span>
                      </CButton>
                    </>
                  ) : (
                    <CButton shape="pill" color="success" size="sm" onClick={(e) => handleApplyClick(offer)}>
                      <CIcon name="cil-at" />
                      <span className="align-middle ml-1">Apply</span>
                    </CButton>
                  )}
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                <div style={{ padding: 20 }}>
                  {offer.description}
                  <div>
                    {offer.tags.map((tag) => (
                      <CBadge onClick={(e) => handleTagClick(tag)} key={tag} className="mt-2 mr-2 align-middle" color="dark" style={{"cursor": "pointer"}}>
                        {tag}
                      </CBadge>
                    ))}
                  </div>
                </div>
                <hr className="m-0" />
                <div style={{ padding: "10px 20px" }}>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color="success" onClick={(e) => handleSalaryClick(offer.salary.min)} style={{"cursor": "pointer"}}>
                    <CIcon name="cil-money" />
                    <span className="align-middle ml-1">
                      {offer.salary.min}€ - {offer.salary.max}€
                    </span>
                  </CBadge>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color="info" onClick={(e) => handleContractClick(offer.contractType)} style={{"cursor": "pointer"}}>
                    <CIcon name="cil-clock" />
                    <span className="align-middle ml-1">{convertKeyString(offer.contractType)}</span>
                  </CBadge>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color={offer.permitRequired ? "danger" : "turquoise"} onClick={(e) => handlePermitClick(offer.permitRequired)} style={{"cursor": "pointer"}}>
                    <CIcon name="cil-description" />
                    <span className="align-middle ml-1">{offer.permitRequired ? "Required" : "Not required"}</span>
                  </CBadge>
                  <CBadge className="my-2 mr-2 p-2 align-middle" color="gold" onClick={(e) => handleLocationClick(offer.location)} style={{"cursor": "pointer"}}>
                    <CIcon name="cil-location-pin" />
                    <span className="align-middle ml-1">{offer.location}</span>
                  </CBadge>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
        <NewOfferModal visible={showEditOfferModal} setVisible={setShowEditOfferModal} offer={currentEditingOffer} />
      </CRow>
    </>
  );
};

export default Offers;
