import CIcon from "@coreui/icons-react";
import { CBadge, CButton, CCol, CInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CInputGroup, CInputGroupAppend } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, markMessageAsRead } from "../../actions/messages";
import { sendSocketMessage } from "../../actions/sockets";

const getCorrespondent = (conversation, auth) => {
  if (!conversation) return "";

  if (auth.result._id === conversation.initiatorId) {
    return conversation.recipient[0].userName;
  } else {
    return conversation.initiator[0].userName;
  }
};

const getCorrespondentId = (conversation, auth) => {
  if (!conversation) return "";

  if (auth.result._id === conversation.initiatorId) {
    return conversation.recipientId;
  } else {
    return conversation.initiatorId;
  }
};

const ConversationModal = ({ visible, setVisible, conversation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages);

  const [conversationMessages, setConversationMessages] = useState([]);
  const [messageBox, setMessageBox] = useState("");

  useEffect(() => {
    if (!conversation) return;

    const newConversationMessages = messages.filter((message) => {
      if (message.conversationId === conversation._id) {
        return true;
      }
      return false;
    });
    setConversationMessages(newConversationMessages);
  }, [messages, conversation, auth]);

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {

    if (messageBox.trim().length < 1) return;

    const newMessage = {
      conversationId: conversation._id,
      message: messageBox,
      isRead: false,
    };

    dispatch(createMessage(newMessage));
    dispatch(sendSocketMessage({ userId: getCorrespondentId(conversation, auth), conversationId: conversation._id }));
    setMessageBox("");
  };

  const handleMarkMessagesAsRead = () => {
    if (!conversation) return;

    const messageList = [];

    for (let message of messages) {
      if (auth.result._id !== message.creatorId && !message.isRead && message.conversationId === conversation._id) {
        messageList.push(message._id);
      }
    }

    if (messageList.length > 0) {
      dispatch(markMessageAsRead(messageList));
    }
  };

  handleMarkMessagesAsRead();

  return (
    <CModal show={visible} onClosed={() => { setVisible(false); }} closeOnBackdrop={false} size="sm" style={{ overflowY: "scroll" }}>
      <CModalHeader>
        <CModalTitle>Conversation with {getCorrespondent(conversation, auth)}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            {[...conversationMessages].map((message) => {
              return (
                <div key={message._id} className={message.creatorId === auth.result._id ? "text-right" : "text-left"}>
                  <p>
                    <CBadge style={{ fontSize: "100%" }} color={message.creatorId === auth.result._id ? "primary" : "dark"}>
                      {message.message}
                    </CBadge>
                  </p>
                  <hr />
                </div>
              );
            })}
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter style={{ display: "block" }}>
        <CRow>
          <CCol lg="12" className="mb-2">
            <CInputGroup>
              <CInput
                type="text"
                id="messageBox"
                name="messageBox"
                value={messageBox}
                onKeyPress={(e) => handleKeyPress(e)}
                onChange={(e) => setMessageBox(e.target.value)}
                placeholder="Message"
                autoComplete="off"
              />
              <CInputGroupAppend>
                <CButton onClick={() => handleSendMessage()} color="primary" className="py-0">
                  <CIcon name="cil-send" size="lg" className="p-0" />
                </CButton>
              </CInputGroupAppend>
            </CInputGroup>
          </CCol>
          <CCol lg="12">
            <CButton style={{ width: "100%" }} onClick={() => setVisible(false)} color="dark">
              Close
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  );
};

export default ConversationModal;
