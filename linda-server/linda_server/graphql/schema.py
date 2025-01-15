"""
Module: schema

This module combines all GraphQL queries and mutations to form the main GraphQL schema.
"""

import strawberry
from linda_server.graphql.queries.user_queries import UserQuery
from linda_server.graphql.mutations.user_mutations import UserMutation
from linda_server.graphql.types.user_types import User

# Import newly created SubscriptionMutation
from linda_server.graphql.mutations.subscription_mutations import SubscriptionMutation

# Also import the existing ApiKeyMutation if you want to unify them into the main schema
from linda_server.graphql.mutations.api_key_mutations import ApiKeyMutation

@strawberry.type
class Query(UserQuery):
    pass

@strawberry.type
class Mutation(UserMutation, SubscriptionMutation, ApiKeyMutation):
    """
    Combine user mutations, subscription mutations, and API key mutations
    into one main Mutation type.
    """
    pass

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    types=[User]
)
