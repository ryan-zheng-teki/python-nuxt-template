import gql from 'graphql-tag';

export const CreateUser = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      fullName
    }
  }
`;

export const UpdateUser = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      fullName
    }
  }
`;

export const DeleteUser = gql`
  mutation DeleteUser($userId: Int!) {
    deleteUser(userId: $userId)
  }
`;

export const Login = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        fullName
      }
    }
  }
`;
