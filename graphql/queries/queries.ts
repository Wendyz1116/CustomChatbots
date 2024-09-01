// need a call/query to get chatbot by id

import { gql } from "@apollo/client";

// Pass in a ID and get the chatbot by the ID
export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

// export const GET_CHATBOTS_BY_USER = gql`
//   query GetChatbotsByUser($clerk_user_id: String!) {
//     chatbotsList(where: { clerk_user_id: $clerk_user_id }) {
//       id
//       name
//       created_at
//       chatbot_characteristics {
//         id
//         content
//         created_at
//       }
//       chat_sessions {
//         id
//         created_at
//         guest_id
//         messages {
//           id
//           content
//           created_at
//         }
//       }
//     }
//   }
// `;

export const GET_ALL_CHATBOTS = gql`
  query GetAllChatbots {
    chatbotsList {
      id
      name
      created_at
      clerk_user_id
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        guests {
          email
          name
        }
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

export const GET_CHAT_SESSION_MESSAGES = gql`
  query GetChatSessionMessages($id: Int!) {
    chat_sessions(id: $id) {
      id
      created_at
      messages {
        id
        content
        created_at
        sender
      }
      chatbots {
        name
      }
      guests {
        name
        email
      }
    }
  }
`;

export const GET_MESSAGE_BY_CHAT_SESSION_ID = gql`
  query GetMessagesByChatSessionId($id: Int!) {
    chat_sessions(id: $id) {
      id
      messages {
        id
        content
        created_at
        sender
      }
    }
  }
`;
