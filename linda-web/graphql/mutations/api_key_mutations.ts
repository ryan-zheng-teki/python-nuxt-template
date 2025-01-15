import gql from 'graphql-tag';

export const GenerateApiKey = gql`
  mutation GenerateApiKey($userId: Int!) {
    generateApiKey(userId: $userId) {
      id
      userId
      keyValue
    }
  }
`;
