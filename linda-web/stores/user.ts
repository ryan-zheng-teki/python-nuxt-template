import { defineStore } from 'pinia'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { CreateUser, UpdateUser, DeleteUser } from '~/graphql/mutations/user_mutations'
import { GetUser, GetAllUsers } from '~/graphql/queries/user_queries'
import type { User } from '~/generated/graphql'

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  authToken: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null,
    authToken: null,
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
      // Optionally, redirect to login page
    },
    // ... existing actions like createUser, updateUser, etc.
    async createUser(input: { username: string; email: string; fullName: string }) {
      this.loading = true
      this.error = null
      const { mutate: createUserMutation } = useMutation(CreateUser)
      try {
        const result = await createUserMutation({ input })
        if (result.data?.createUser) {
          this.users = [...this.users, result.data.createUser]
        }
      } catch (error) {
        this.error = 'Failed to create user'
        console.error('Error creating user:', error)
      } finally {
        this.loading = false
      }
    },
    // Add login action
    async login(username: string, password: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authentication headers if necessary
          },
          body: JSON.stringify({
            query: `
              mutation Login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                  token
                  user {
                    id
                    username
                    email
                    fullName
                  }
                }
              }
            `,
            variables: { username, password },
          }),
        })

        const result = await response.json()

        if (result.data?.login) {
          this.setAuthToken(result.data.login.token)
          this.currentUser = result.data.login.user
        } else if (result.errors) {
          this.error = result.errors[0].message
        }
      } catch (error) {
        this.error = 'Failed to login'
        console.error('Error logging in:', error)
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.authToken,
    userById: (state) => (id: number) => state.users.find(u => u.id === id),
  },
})