import CIcon from "@coreui/icons-react";
import { CBadge, CButton, CCol, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSelect, CTextarea } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCandidate, updateCandidate } from "../../actions/candidates";
import { cleanString } from "../../core/functions";

const initialState = {
  title: "",
  description: "",
  tags: [],
  availability: "available",
  expMonths: 0,
};

const NewCandidatureModal = ({ visible, setVisible, candidature }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let initialFormState = candidature ? candidature : initialState;

  useEffect(() => {
    setCandidatureData(initialFormState);
  }, [initialFormState]);

  const [candidatureData, setCandidatureData] = useState({ ...initialState, creatorId: auth?.result?._id });

  const handleSubmit = async (e) => {
    e.preventDefault();
    candidature ? dispatch(updateCandidate(candidature._id, candidatureData)) : dispatch(createCandidate(candidatureData));
    setCandidatureData({ ...initialState, creatorId: auth?.result?._id });
    setVisible(false);
  };

  const [currentTag, setCurrentTag] = useState("");

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const cleanTag = cleanString(currentTag);
      if (!candidatureData.tags.includes(cleanTag) && cleanTag.length > 0) {
        setCandidatureData({
          ...candidatureData,
          tags: [...candidatureData.tags, cleanTag],
        });
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
    const newTagList = candidatureData.tags.filter((tag) => tag !== tagToRemove);
    setCandidatureData({ ...candidatureData, tags: newTagList });
  };

  return (
    <CModal show={visible} onClose={() => setVisible(false)} closeOnBackdrop={false}>
      <CModalHeader>
        <CModalTitle>New candidate posting</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <p className="text-muted">Please fill the form</p>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="candidature-title">Title</CLabel>
                <CInput
                  type="text"
                  id="candidature-title"
                  placeholder="Title for this candidature"
                  value={candidatureData.title}
                  onChange={(e) =>
                    setCandidatureData({
                      ...candidatureData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="candidature-description">Description</CLabel>
                <CTextarea
                  rows="4"
                  id="candidature-description"
                  placeholder="Description for this candidature"
                  value={candidatureData.description}
                  onChange={(e) =>
                    setCandidatureData({
                      ...candidatureData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="candidature-tags">Tags</CLabel>
                <CInput
                  onKeyDown={handleKeyPress}
                  onKeyUp={handleKeyRelease}
                  type="text"
                  id="candidature-tags"
                  placeholder="Tags for this candidature (press Enter to add)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                {candidatureData.tags.map((tag) => (
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
                <CLabel htmlFor="experience">Experience in months</CLabel>
                <CInput
                  type="number"
                  id="experience"
                  placeholder="Experience for this candidature"
                  value={candidatureData.expMonths}
                  onChange={(e) =>
                    setCandidatureData({
                      ...candidatureData,
                      expMonths: e.target.value ? parseInt(e.target.value) : "",
                    })
                  }
                  required
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="availability">Contract type</CLabel>
                <CSelect
                  custom
                  id="availability"
                  value={candidatureData.availability}
                  onChange={(e) =>
                    setCandidatureData({
                      ...candidatureData,
                      availability: e.target.value,
                    })
                  }
                >
                  <option value="available">Available</option>
                  <option value="listening-to-offers">Listening to offers</option>
                  <option value="not-available">Not available</option>
                </CSelect>
              </CFormGroup>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setVisible(false)} color="dark">
            Close
          </CButton>
          <CButton color="success" type="submit">
            {candidature ? "Update candidature" : "Add candidature"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default NewCandidatureModal;
