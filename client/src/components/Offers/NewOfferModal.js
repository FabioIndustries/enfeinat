import CIcon from "@coreui/icons-react";
import { CBadge, CButton, CCol, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSelect, CTextarea } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOffer, updateOffer } from "../../actions/offers";
import { cleanString } from "../../core/functions";

const initialState = {
  title: "",
  description: "",
  tags: [],
  salary: {
    min: 0,
    max: 0,
  },
  contractType: "full-time",
  permitRequired: true,
  location: "",
};

const NewOfferModal = ({ visible, setVisible, offer }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let initialFormState = offer ? offer : initialState;

  const [offerData, setOfferData] = useState({ ...initialFormState, creatorId: auth?.result?._id });

  useEffect(() => {
    setOfferData(initialFormState);
  }, [initialFormState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    offer ? dispatch(updateOffer(offer._id, offerData)) : dispatch(createOffer(offerData));
    setOfferData({ ...initialState, creatorId: auth?.result?._id });
    setVisible(false);
  };

  const [currentTag, setCurrentTag] = useState("");

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const cleanTag = cleanString(currentTag);
      if (!offerData.tags.includes(cleanTag) && cleanTag.length > 0) {
        setOfferData({ ...offerData, tags: [...offerData.tags, cleanTag] });
      }
    }
  };

  const handleKeyRelease = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTagList = offerData.tags.filter((tag) => tag !== tagToRemove);
    setOfferData({ ...offerData, tags: newTagList });
  };

  return (
    <CModal show={visible} onClose={() => setVisible(false)} closeOnBackdrop={false}>
      <CModalHeader>
        <CModalTitle>
          New job offer
          {/* <h1 className="m-0">New job offer</h1> */}
        </CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <p className="text-muted">Please fill the form</p>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="title">Title</CLabel>
                <CInput
                  type="text"
                  id="title"
                  placeholder="Title for this offer"
                  value={offerData.title}
                  onChange={(e) => setOfferData({ ...offerData, title: e.target.value })}
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="description">Description</CLabel>
                <CTextarea
                  rows="4"
                  id="description"
                  placeholder="Description for this offer"
                  value={offerData.description}
                  onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="tags">Tags</CLabel>
                <CInput
                  onKeyDown={handleKeyPress}
                  onKeyUp={handleKeyRelease}
                  type="text"
                  id="tags"
                  placeholder="Tags for this offer (press Enter to add)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                {offerData.tags.map((tag) => (
                  <CBadge key={tag} shape="pill" className="my-2 mr-2 p-2 align-middle" color="dark" style={{"cursor": "default"}}>
                    <CIcon name="cil-x" style={{"cursor": "pointer"}} onClick={() => handleRemoveTag(tag)} />
                    <span className="align-middle"> {tag}</span>
                  </CBadge>
                ))}
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="min-salary">Minimum salary</CLabel>
                <CInput
                  type="number"
                  id="min-salary"
                  placeholder="Min. salary for this offer"
                  value={offerData.salary.min}
                  onChange={(e) =>
                    setOfferData({
                      ...offerData,
                      salary: {
                        min: e.target.value ? parseInt(e.target.value) : "",
                        max: offerData.salary.max,
                      },
                    })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="max-salary">Maximum salary</CLabel>
                <CInput
                  type="number"
                  id="max-salary"
                  placeholder="Max. salary for this offer"
                  value={offerData.salary.max}
                  onChange={(e) =>
                    setOfferData({
                      ...offerData,
                      salary: {
                        min: offerData.salary.min,
                        max: e.target.value ? parseInt(e.target.value) : "",
                      },
                    })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="contract-type">Contract type</CLabel>
                <CSelect custom id="contract-type" value={offerData.contractType} onChange={(e) => setOfferData({ ...offerData, contractType: e.target.value })}>
                  <option value="full-time">Full time</option>
                  <option value="part-time">Part time</option>
                  <option value="extra-hours">Extra hours</option>
                  <option value="casual">Casual</option>
                </CSelect>
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="permit">Work permit required</CLabel>
                <CSelect
                  custom
                  id="permit"
                  value={offerData.permitRequired ? "required" : "not-required"}
                  onChange={(e) =>
                    setOfferData({
                      ...offerData,
                      permitRequired: e.target.value === "required" ? true : false,
                    })
                  }
                >
                  <option value="required">Required</option>
                  <option value="not-required">Not required</option>
                </CSelect>
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="location">Location</CLabel>
                <CInput
                  type="text"
                  id="location"
                  placeholder="Location for this offer"
                  value={offerData.location}
                  onChange={(e) => setOfferData({ ...offerData, location: e.target.value })}
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setVisible(false)} color="dark">
            Close
          </CButton>
          <CButton color="success" type="submit">
            {offer ? "Update offer" : "Add offer"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default NewOfferModal;
