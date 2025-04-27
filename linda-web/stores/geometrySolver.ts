import { defineStore } from 'pinia'
import apiService from '~/services/api'

// Directly specify the base URLs
const API_BASE_URL = 'http://localhost:6233'
const STREAM_BASE_URL = 'http://localhost:9233'

export const useGeometrySolverStore = defineStore('geometrySolver', {
  state: () => ({
    agentId: null as string | null,
    runId: null as string | null,
    analysis: '' as string,
    streaming: false as boolean,
    solution: null as Array<{ description: string; reasoning?: string; calculation?: string; final_answer?: string }> | null
  }),

  actions: {
    async startAgent() {
      try {
        // Make a direct API call to ensure correct URL
        const resp = await fetch(`${API_BASE_URL}/api/agents/CoordinatorAgent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: {},
            action: '',
            schedule: null,
            taskQueue: 'restack'
          })
        })
        
        if (!resp.ok) {
          throw new Error(`API error: ${resp.status}`)
        }
        
        const data = await resp.json()
        this.agentId = data.agentId
        this.runId = data.runId
        
        console.log('Agent started successfully:', this.agentId, this.runId)
      } catch (err) {
        console.error('Failed to start agent:', err)
        throw err
      }
    },

    async streamProblem(problemText: string) {
      if (!this.agentId || !this.runId) {
        throw new Error('Agent not initialized')
      }

      this.streaming = true
      this.analysis  = ''
      this.solution  = null
      
      console.log('Streaming problem with:', {
        agentId: this.agentId,
        runId: this.runId,
        problemText
      })

      try {
        // Use the direct streaming URL
        const url = `${STREAM_BASE_URL}/stream/agents/CoordinatorAgent/${this.agentId}/${this.runId}/chat/completions`
        
        const body = {
          eventName: 'submit_problem',
          eventInput: { problem_text: problemText, image_path: null }
        }

        console.log('Streaming request to URL:', url)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        
        if (!response.ok) {
          throw new Error(`Streaming error: ${response.status}`)
        }
        
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          this.analysis += decoder.decode(value, { stream: true })
        }
      } catch (err) {
        console.error('Error during streaming:', err)
        throw err
      } finally {
        this.streaming = false
      }

      // Simple parse into steps
      const lines = this.analysis.split('\n').filter(l => l.trim())
      this.solution = lines.map(line => ({
        description: line,
        reasoning: '',
        calculation: ''
      }))
    },

    reset() {
      this.agentId  = null
      this.runId    = null
      this.analysis = ''
      this.streaming = false
      this.solution = null
    }
  }
})
