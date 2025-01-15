import { defineStore } from 'pinia'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { CreateUser, UpdateUser, DeleteUser, Login } from '~/graphql/mutations/user_mutations'
import { GetUser, GetAllUsers } from '~/graphql/queries/user_queries'
import { BuySubscription, CancelSubscription } from '~/graphql/mutations/subscription_mutations'
import { GenerateApiKey } from '~/graphql/mutations/api_key_mutations'
import type { 
  User,
  CreateUserMutation,
  CreateUserMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  LoginMutation,
  LoginMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
  GetAllUsersQuery,
  GetAllUsersQueryVariables,
  BuySubscriptionMutation,
  BuySubscriptionMutationVariables,
  GenerateApiKeyMutation,
  GenerateApiKeyMutationVariables
} from '~/generated/graphql'

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  authToken: string | null;
  apiKey: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null,
    authToken: null,
    apiKey: null,
  }),

  actions: {
    setAuthToken(token: string) {
      this.authToken = token
      localStorage.setItem('authToken', token)
    },

    clearAuthToken() {
      this.authToken = null
      localStorage.removeItem('authToken')
    },

    logout() {
      this.clearAuthToken()
      this.currentUser = null
      this.apiKey = null
    },

    async login(username: string, password: string): Promise<boolean> {
      this.loading = true
      this.error = null
      const { mutate: loginMutation } = useMutation<LoginMutation, LoginMutationVariables>(Login)
      
      try {
        const result = await loginMutation({
          input: {
            username,
            password
          }
        })
        
        if (result.data?.login) {
          const { token, user } = result.data.login
          this.setAuthToken(token)
          this.currentUser = user
          return true
        }
        return false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to login'
        console.error('Error logging in:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async createUser(input: {
      username: string;
      email: string;
      fullName: string;
      password: string;
    }) {
      if (!input.password) {
        this.error = 'Password is required'
        return
      }

      this.loading = true
      this.error = null
      const { mutate: createUserMutation } = useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUser)
      
      try {
        const result = await createUserMutation({
          input: {
            username: input.username,
            email: input.email,
            fullName: input.fullName,
            password: input.password
          }
        })
        
        if (result.data?.createUser) {
          this.users = [...this.users, result.data.createUser]
          await this.login(input.username, input.password)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create user'
        console.error('Error creating user:', error)
      } finally {
        this.loading = false
      }
    },

    async updateUser(input: {
      id: number;
      username?: string;
      email?: string;
      fullName?: string;
      password?: string;
    }) {
      this.loading = true
      this.error = null
      const { mutate: updateUserMutation } = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUser)
      
      try {
        const result = await updateUserMutation({ input })
        if (result.data?.updateUser) {
          const updatedUser = result.data.updateUser
          this.users = this.users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
          if (this.currentUser?.id === updatedUser.id) {
            this.currentUser = updatedUser
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user'
        console.error('Error updating user:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId: number) {
      this.loading = true
      this.error = null
      const { mutate: deleteUserMutation } = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUser)
      
      try {
        const result = await deleteUserMutation({ userId })
        if (result.data?.deleteUser) {
          this.users = this.users.filter(user => user.id !== userId)
          if (this.currentUser?.id === userId) {
            this.logout()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete user'
        console.error('Error deleting user:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      if (!this.currentUser?.id) {
        this.error = 'No user ID available'
        return
      }

      this.loading = true
      this.error = null
      const { onResult, onError } = useQuery<GetUserQuery, GetUserQueryVariables>(
        GetUser,
        { userId: this.currentUser.id }
      )

      onResult((result) => {
        if (result.data?.user) {
          this.currentUser = result.data.user
        }
        this.loading = false
      })

      onError((error) => {
        this.error = error.message
        this.loading = false
        console.error('Error fetching current user:', error)
      })
    },

    async fetchAllUsers() {
      this.loading = true
      this.error = null
      const { onResult, onError } = useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsers)
      
      onResult((result) => {
        if (result.data?.users) {
          this.users = result.data.users
        }
        this.loading = false
      })

      onError((error) => {
        this.error = error.message
        this.loading = false
        console.error('Error fetching users:', error)
      })
    },

    async buySubscription(planType: string, durationDays: number) {
      if (!this.currentUser) {
        this.error = 'User is not logged in.'
        return
      }
      this.loading = true
      this.error = null
      const { mutate: buySubscriptionMutation } = useMutation<BuySubscriptionMutation, BuySubscriptionMutationVariables>(BuySubscription)
      try {
        const result = await buySubscriptionMutation({
          userId: this.currentUser.id,
          planType,
          durationDays
        })
        if (!result.data?.buySubscription) {
          this.error = 'Failed to buy subscription.'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error buying subscription'
        console.error('buySubscription error:', error)
      } finally {
        this.loading = false
      }
    },

    async generateApiKey() {
      if (!this.currentUser) {
        this.error = 'User is not logged in.'
        return
      }
      this.loading = true
      this.error = null
      const { mutate: generateApiKeyMutation } = useMutation<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>(GenerateApiKey)
      try {
        const result = await generateApiKeyMutation({
          userId: this.currentUser.id
        })
        if (result.data?.generateApiKey?.keyValue) {
          this.apiKey = result.data.generateApiKey.keyValue
        } else {
          this.error = 'Failed to generate API key.'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error generating API key'
        console.error('generateApiKey error:', error)
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.authToken,
    userById: (state) => (id: number) => state.users.find(u => u.id === id),
  },
})
