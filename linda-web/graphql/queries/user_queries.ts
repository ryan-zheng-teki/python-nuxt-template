import gql from 'graphql-tag';

export const GetUser = gql`
  query GetUser($userId: Int!) {
    user(userId: $userId) {
      id
      username
      email
      fullName
    }
  }
`;

export const GetAllUsers = gql`
  query GetAllUsers {
    users {
      id
      username
      email
      fullName
    }
  }
`;