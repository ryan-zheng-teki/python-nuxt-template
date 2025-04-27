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
        
        // Format the payload to match the MessagesEvent structure
        const body = {
          messages: [
            {
              role: "user",
              content: problemText
            }
          ],
          // Explicitly request streaming mode
          stream: true
        }

        console.log('Streaming request to URL:', url)
        console.log('Streaming request payload:', body)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream' // Explicitly request server-sent events
          },
          body: JSON.stringify(body)
        })
        
        if (!response.ok) {
          throw new Error(`Streaming error: ${response.status}`)
        }
        
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          
          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true })
          
          // Process complete messages in the buffer
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep the last incomplete line in the buffer
          
          for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue
            
            // Handle SSE format if the API returns "data: {json}"
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6) // Remove "data: " prefix
                // If it's JSON, parse it
                if (jsonStr.trim() && jsonStr !== '[DONE]') {
                  const data = JSON.parse(jsonStr)
                  // Extract the content chunk from the response
                  // Adjust this based on the actual format your API returns
                  if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                    this.analysis += data.choices[0].delta.content
                  }
                }
              } catch (e) {
                // If parsing fails, just add the raw content
                console.warn('Failed to parse streaming JSON chunk:', e)
                // For non-JSON content or plaintext streaming, append directly
                this.analysis += line.substring(6)
              }
            } else {
              // If not in SSE format, just add the raw text
              this.analysis += line + '\n'
            }
          }
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
