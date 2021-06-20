import React, { useEffect, useState } from "react";
import { CRow, CCol, CCardBody, CCard, CCardHeader, CDataTable, CBadge } from "@coreui/react";
import moment from "moment";
import { useSelector } from "react-redux";
import ConversationModal from "./ConversationModal";
import { useHistory } from "react-router-dom";

const getCorrespondent = (conversation, auth) => {
  if (auth.result._id === conversation.initiatorId) {
    return conversation.recipient[0].userName;
  } else {
    return conversation.initiator[0].userName;
  }
};

const getConversationType = (conversation) => {
  if (conversation.documentType === 0) {
    return "Offer";
  } else {
    return "Candidature";
  }
};

const getDocumentTitle = (conversation, offers, candidates) => {
  if (conversation.documentType === 0) {
    if (!offers) return "Error";
    const offer = offers.find((offer) => offer._id === conversation.relatedDocumentId);
    if (!offer) return "Error";
    return offer.title;
  } else {
    if (!candidates) return "Error";
    const candidate = candidates.find((candidate) => candidate._id === conversation.relatedDocumentId);
    if (!candidate) return "Error";
    return candidate.title;
  }
};

const getMessagesInformation = (conversation, messages, auth) => {
  let count = 0;
  let unread = false;
  for (let message of messages) {
    if (message.conversationId === conversation._id) {
      count++;
      if (!message.isRead && auth.result._id !== message.creatorId) {
        unread = true;
      }
    }
  }
  return { count, unread };
};

const getLastMessageDate = (conversation, messages) => {
  let lastDate;
  for (let message of messages) {
    if (message.conversationId === conversation._id) {
      if (!lastDate || lastDate < message.createdAt) {
        lastDate = message.createdAt;
      }
    }
  }

  return lastDate ? moment(lastDate).format("MMMM Do YYYY, HH:mm:ss") : "Never";
};

const Messaging = ({ match }) => {
  const history = useHistory();
  const [conversationsList, setConversationsList] = useState([]);
  const auth = useSelector((state) => state.auth);
  const conversations = useSelector((state) => state.conversations);
  const messages = useSelector((state) => state.messages);
  const offers = useSelector((state) => state.offers);
  const candidates = useSelector((state) => state.candidates);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const newConversationList = conversations.map((conversation) => {
      const newConversation = {
        conversation: conversation,
        type: getConversationType(conversation),
        title: getDocumentTitle(conversation, offers, candidates),
        correspondent: getCorrespondent(conversation, auth),
        messages: getMessagesInformation(conversation, messages, auth),
        lastMessage: getLastMessageDate(conversation, messages),
      };
      return newConversation;
    });

    setConversationsList(newConversationList);
  }, [conversations, auth, offers, candidates, messages]);

  useEffect(() => {
    if (!match.params.id) return;

    const conversation = conversations.find((conversation) => conversation._id === match.params.id);
    setShowConversationModal(true);
    setCurrentConversation(conversation);
  }, [match.params.id, conversations]);

  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader>Enfeina't Inbox</CCardHeader>
            <CCardBody>
              <CDataTable
                items={[...conversationsList].reverse()}
                fields={[{ key: "type", _classes: "font-weight-bold" }, "title", "correspondent", "messages", "lastMessage"]}
                hover
                striped
                clickableRows
                onRowClick={(item) => {
                  history.push(`/messaging/${item.conversation._id}`);
                  setCurrentConversation(item.conversation);
                  setShowConversationModal(true);
                }}
                scopedSlots={{
                  messages: (item) => (
                    <td>
                      <CBadge color={item.messages.unread ? "danger" : "dark"}>
                        {item.messages.count.toString()} {item.messages.unread ? "(NEW)" : ""}
                      </CBadge>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ConversationModal visible={showConversationModal} setVisible={setShowConversationModal} conversation={currentConversation} />
    </>
  );
};

export default Messaging;
