import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $name: String!
    $created_at: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      name: $name
      created_at: $created_at
    ) {
      id
      name
    }
  }
`;

// TODO fig out error
// ApolloError: Server response was missing for query 'AddCharacteristic'.

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $content: String!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      content: $content
      created_at: $created_at
    ) {
      id
      content
      created_at
    }
  }
`;

// NOTE what does the $ mean, a copy? or ref it as a str
export const INSERT_MESSAGE = gql`
  mutation insertMessages(
    $created_at: DateTime!
    $chat_session_id: Int!
    $content: String!
    $sender: String!
  ) {
    insertMessages(
      created_at: $created_at
      chat_session_id: $chat_session_id
      content: $content
      sender: $sender
    ) {
      id
      content
      created_at
      sender
    }
  }
`;

export const INSERT_GUEST = gql`
  mutation insertGuest(
    $created_at: DateTime!
    $name: String!
    $email: String!
  ) {
    insertGuests(created_at: $created_at, name: $name, email: $email) {
      id
    }
  }
`;

export const INSERT_CHAT_SESSION = gql`
  mutation insertChatSession(
    $created_at: DateTime!
    $chatbot_id: Int!
    $guest_id: Int!
  ) {
    insertChat_sessions(
      created_at: $created_at
      chatbot_id: $chatbot_id
      guest_id: $guest_id
    ) {
      id
    }
  }
`;
