import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from '@vue/composition-api';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ApiKey = {
  __typename?: 'ApiKey';
  id: Scalars['Int']['output'];
  keyValue: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  buySubscription: Scalars['Boolean']['output'];
  cancelSubscription: Scalars['Boolean']['output'];
  createUser: User;
  deleteUser: Scalars['Boolean']['output'];
  generateApiKey: ApiKey;
  login: LoginPayload;
  updateUser: User;
};


export type MutationBuySubscriptionArgs = {
  durationDays: Scalars['Int']['input'];
  planType: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationCancelSubscriptionArgs = {
  subscriptionId: Scalars['Int']['input'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationGenerateApiKeyArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  downloadLibraryUrl: Scalars['String']['output'];
  user: User;
  users: Array<User>;
};


export type QueryUserArgs = {
  userId: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type GenerateApiKeyMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GenerateApiKeyMutation = { __typename?: 'Mutation', generateApiKey: { __typename?: 'ApiKey', id: number, userId: number, keyValue: string } };

export type BuySubscriptionMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
  planType: Scalars['String']['input'];
  durationDays: Scalars['Int']['input'];
}>;


export type BuySubscriptionMutation = { __typename?: 'Mutation', buySubscription: boolean };

export type CancelSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['Int']['input'];
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancelSubscription: boolean };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: number, username: string, email: string, fullName: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, username: string, email: string, fullName: string } };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', token: string, user: { __typename?: 'User', id: number, username: string, email: string, fullName: string } } };

export type GetUserQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: number, username: string, email: string, fullName: string } };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, username: string, email: string, fullName: string }> };


export const GenerateApiKeyDocument = gql`
    mutation GenerateApiKey($userId: Int!) {
  generateApiKey(userId: $userId) {
    id
    userId
    keyValue
  }
}
    `;

/**
 * __useGenerateApiKeyMutation__
 *
 * To run a mutation, you first call `useGenerateApiKeyMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useGenerateApiKeyMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useGenerateApiKeyMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useGenerateApiKeyMutation(options: VueApolloComposable.UseMutationOptions<GenerateApiKeyMutation, GenerateApiKeyMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>(GenerateApiKeyDocument, options);
}
export type GenerateApiKeyMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>;
export const BuySubscriptionDocument = gql`
    mutation BuySubscription($userId: Int!, $planType: String!, $durationDays: Int!) {
  buySubscription(
    userId: $userId
    planType: $planType
    durationDays: $durationDays
  )
}
    `;

/**
 * __useBuySubscriptionMutation__
 *
 * To run a mutation, you first call `useBuySubscriptionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useBuySubscriptionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useBuySubscriptionMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *     planType: // value for 'planType'
 *     durationDays: // value for 'durationDays'
 *   },
 * });
 */
export function useBuySubscriptionMutation(options: VueApolloComposable.UseMutationOptions<BuySubscriptionMutation, BuySubscriptionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<BuySubscriptionMutation, BuySubscriptionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<BuySubscriptionMutation, BuySubscriptionMutationVariables>(BuySubscriptionDocument, options);
}
export type BuySubscriptionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<BuySubscriptionMutation, BuySubscriptionMutationVariables>;
export const CancelSubscriptionDocument = gql`
    mutation CancelSubscription($subscriptionId: Int!) {
  cancelSubscription(subscriptionId: $subscriptionId)
}
    `;

/**
 * __useCancelSubscriptionMutation__
 *
 * To run a mutation, you first call `useCancelSubscriptionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCancelSubscriptionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCancelSubscriptionMutation({
 *   variables: {
 *     subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useCancelSubscriptionMutation(options: VueApolloComposable.UseMutationOptions<CancelSubscriptionMutation, CancelSubscriptionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>(CancelSubscriptionDocument, options);
}
export type CancelSubscriptionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    fullName
  }
}
    `;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateUserMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(options: VueApolloComposable.UseMutationOptions<CreateUserMutation, CreateUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateUserMutation, CreateUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
}
export type CreateUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    username
    email
    fullName
  }
}
    `;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateUserMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(options: VueApolloComposable.UseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
}
export type UpdateUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: Int!) {
  deleteUser(userId: $userId)
}
    `;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteUserMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(options: VueApolloComposable.UseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
}
export type DeleteUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteUserMutation, DeleteUserMutationVariables>;
export const LoginDocument = gql`
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

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLoginMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(options: VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LoginMutation, LoginMutationVariables>;
export const GetUserDocument = gql`
    query GetUser($userId: Int!) {
  user(userId: $userId) {
    id
    username
    email
    fullName
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a Vue component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetUserQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useGetUserQuery(variables: GetUserQueryVariables | VueCompositionApi.Ref<GetUserQueryVariables> | ReactiveFunction<GetUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options);
}
export function useGetUserLazyQuery(variables?: GetUserQueryVariables | VueCompositionApi.Ref<GetUserQueryVariables> | ReactiveFunction<GetUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserQuery, GetUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options);
}
export type GetUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetUserQuery, GetUserQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  users {
    id
    username
    email
    fullName
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a Vue component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAllUsersQuery();
 */
export function useGetAllUsersQuery(options: VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, {}, options);
}
export function useGetAllUsersLazyQuery(options: VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllUsersQuery, GetAllUsersQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, {}, options);
}
export type GetAllUsersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAllUsersQuery, GetAllUsersQueryVariables>;