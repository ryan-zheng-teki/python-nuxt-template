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
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null,
  }),
  actions: {
    async createUser(input: { username: string; email: string; fullName: string }) {
      this.loading = true
      this.error = null
      const { mutate: createUserMutation } = useMutation(CreateUser)
      try {
        const result = await createUserMutation({ input })
        if (result.data?.createUser) {
          // Create a new array to ensure mutability
          this.users = [...this.users, result.data.createUser]
        }
      } catch (error) {
        this.error = 'Failed to create user'
        console.error('Error creating user:', error)
      } finally {
        this.loading = false
      }
    },
    async updateUser(input: { id: number; username?: string; email?: string; fullName?: string }) {
      this.loading = true
      this.error = null
      const { mutate: updateUserMutation } = useMutation(UpdateUser)
      try {
        const result = await updateUserMutation({ input })
        if (result.data?.updateUser) {
          // Create a new array with the updated user
          this.users = this.users.map(u => u.id === input.id ? result.data.updateUser : u)
          
          if (this.currentUser?.id === input.id) {
            // Ensure currentUser is also a new object
            this.currentUser = { ...result.data.updateUser }
          }
        }
      } catch (error) {
        this.error = 'Failed to update user'
        console.error('Error updating user:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteUser(userId: number) {
      this.loading = true
      this.error = null
      const { mutate: deleteUserMutation } = useMutation(DeleteUser)
      try {
        const result = await deleteUserMutation({ userId })
        if (result.data?.deleteUser) {
          // Create a new array without the deleted user
          this.users = this.users.filter(u => u.id !== userId)
          
          if (this.currentUser?.id === userId) {
            this.currentUser = null
          }
        }
      } catch (error) {
        this.error = 'Failed to delete user'
        console.error('Error deleting user:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchUser(userId: number) {
      this.loading = true
      this.error = null
      const { onResult, onError } = useQuery(GetUser, { userId })
      
      onResult((result) => {
        if (result.data?.user) {
          // Ensure currentUser is a new object
          this.currentUser = { ...result.data.user }
        }
        this.loading = false
      })
      
      onError((error) => {
        this.error = 'Failed to fetch user'
        console.error('Error fetching user:', error)
        this.loading = false
      })
    },
    async fetchAllUsers() {
      this.loading = true
      this.error = null
      const { onResult, onError } = useQuery(GetAllUsers)
      
      onResult((result) => {
        if (result.data?.users) {
          // Create a new array to ensure mutability
          this.users = [...result.data.users]
        }
        this.loading = false
      })
      
      onError((error) => {
        this.error = 'Failed to fetch users'
        console.error('Error fetching users:', error)
        this.loading = false
      })
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userById: (state) => (id: number) => state.users.find(u => u.id === id),
  },
})
