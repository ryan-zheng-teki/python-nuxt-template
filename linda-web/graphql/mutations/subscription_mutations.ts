import gql from 'graphql-tag';

export const BuySubscription = gql`
  mutation BuySubscription($userId: Int!, $planType: String!, $durationDays: Int!) {
    buySubscription(userId: $userId, planType: $planType, durationDays: $durationDays)
  }
`;

export const CancelSubscription = gql`
  mutation CancelSubscription($subscriptionId: Int!) {
    cancelSubscription(subscriptionId: $subscriptionId)
  }
`;
