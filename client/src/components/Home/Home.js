import CIcon from "@coreui/icons-react";
import { CButton, CCol, CJumbotron, CRow, CWidgetIcon } from "@coreui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const Home = () => {
  const router = useHistory();
  const general = useSelector((state) => state.general);
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <CJumbotron>
        <h1 className="display-3">Enfeina't</h1>
        <p className="lead">A new job platform in Andorra</p>
        <p>
          Enfeina't aims at tackling the problems that arise when trying find a
          job in Andorra, while also providing companies a great place to find
          the perfect candidate for them.
        </p>
        <p>
          You can register now as a Job Hunter or as a Company to start browsing
          away!
        </p>

        {!auth && (
          <>
            <div className="mt-4 d-md-none d-flex d-flex justify-content-between px-3">
              <CButton color="blue" onClick={() => router.push("/signup")}>
                I need a job
              </CButton>
              <CButton color="turquoise" onClick={() => router.push("/signup")}>
                I need employees
              </CButton>
            </div>

            <div className="d-sm-down-none">
              <CButton
                className="mr-4"
                color="blue"
                onClick={() => router.push("/signup")}
              >
                I need a job
              </CButton>
              <CButton color="turquoise" onClick={() => router.push("/signup")}>
                I need employees
              </CButton>
            </div>
          </>
        )}
      </CJumbotron>

      <CRow className="mt-2">
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text="users"
            header={general?.users?.toString()}
            color="blue"
          >
            <CIcon name={"cilUser"} size={"xl"} />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text="offers"
            header={general?.offers?.toString()}
            color="danger"
          >
            <CIcon name={"cilBriefcase"} size={"xl"} />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text="candidatures"
            header={general?.candidatures?.toString()}
            color="turquoise"
          >
            <CIcon name={"cilBuilding"} size={"xl"} />
          </CWidgetIcon>
        </CCol>
      </CRow>

      {/* <CCard borderColor="danger">
        <CCardHeader>
          This website is part of a "Projecte de Final de Carrera"
            </CCardHeader>
        <CCardBody>
          This platform was created as part of my "Project de Final de Carrera" for the University of Andorra. My name is Fabio Amorim and my email is <code>famorim@uda.ad</code>.
        </CCardBody>
      </CCard> */}
    </>
  );
};

export default Home;
