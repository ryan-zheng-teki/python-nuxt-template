"""
Module: schema

This module combines all GraphQL queries and mutations to form the main GraphQL schema.
"""

import strawberry
from linda_server.graphql.queries.user_queries import UserQuery
from linda_server.graphql.mutations.user_mutations import UserMutation
from linda_server.graphql.types.user_types import User
from linda_server.graphql.types.geometry_types import GeometrySolution

@strawberry.type
class Query(UserQuery):
    pass

@strawberry.type
class Mutation(UserMutation):
    """
    Main Mutation type for user authentication and geometry problem solving.
    """
    pass

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    types=[User, GeometrySolution]
)
