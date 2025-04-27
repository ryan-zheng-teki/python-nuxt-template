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
    solution: null as Array<{ description: string; reasoning?: string; calculation?: string; final_answer?: string }> | null,
    error: null as string | null
  }),

  actions: {
    async terminateAgent() {
      // Only attempt to terminate if we have valid agentId and runId
      if (!this.agentId || !this.runId) {
        console.log('No active geometry solver agent to terminate')
        return true // Success case - nothing to terminate
      }

      try {
        console.log('Terminating geometry solver agent:', this.agentId, this.runId)
        
        // Create the termination endpoint URL
        const terminationUrl = `${API_BASE_URL}/api/agents/event/${this.agentId}/${this.runId}`
        
        // Send termination request
        const response = await fetch(terminationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventName: "end",
            eventInput: {} // Empty input is sufficient
          })
        })
        
        if (!response.ok) {
          console.warn(`Agent termination returned status: ${response.status}`)
          // Don't throw error here, as the agent might already be terminated
        } else {
          console.log('Geometry solver agent terminated successfully')
        }
        
        // Clear agent IDs regardless of success to avoid reusing terminated agents
        this.agentId = null
        this.runId = null
        
        return true
      } catch (err) {
        console.error('Error during agent termination:', err)
        // Don't propagate error upwards, just log it
        // We'll still clear agent IDs to be safe
        this.agentId = null
        this.runId = null
        return false
      }
    },

    async startAgent() {
      try {
        // Terminate any existing agent first
        await this.terminateAgent()
        
        console.log('Starting geometry solver agent...')
        
        // Make a direct API call to ensure correct URL
        const resp = await fetch(`${API_BASE_URL}/api/agents/MathMasterAgent`, {
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
        
        console.log('Geometry solver agent started successfully:', this.agentId, this.runId)
        return true
      } catch (err) {
        console.error('Failed to start geometry solver agent:', err)
        this.error = 'Failed to connect to the solver agent'
        return false
      }
    },

    async ensureAgentInitialized() {
      // If agent isn't initialized, initialize it
      if (!this.agentId || !this.runId) {
        return await this.startAgent()
      }
      return true
    },

    async streamProblem(problemText: string) {
      // Ensure agent is initialized before proceeding
      const isInitialized = await this.ensureAgentInitialized()
      if (!isInitialized) {
        throw new Error('Failed to initialize geometry solver agent')
      }

      this.streaming = true
      this.analysis = ''
      this.error = null
      
      // Initialize solution as a single item that will be updated reactively
      this.solution = [{
        description: 'Analyzing the problem...',
        reasoning: '',
        calculation: ''
      }]
      
      console.log('Streaming problem with:', {
        agentId: this.agentId,
        runId: this.runId,
        problemText
      })

      try {
        // Use the direct streaming URL
        const url = `${STREAM_BASE_URL}/stream/agents/MathMasterAgent/${this.agentId}/${this.runId}/chat/completions`
        
        // Format the payload to match the MessagesEvent structure
        const body = {
          messages: [
            {
              role: "user",
              content: problemText
            }
          ],
          stream: true
        }

        console.log('Streaming request to URL:', url)
        console.log('Streaming request payload:', body)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(body)
        })
        
        if (!response.ok) {
          // If we get a 404 or other error, the agent may have expired
          if (response.status === 404 || response.status === 400) {
            console.warn('Agent session may have expired, retrying with a new agent')
            
            // Terminate the current agent (even though it may be invalid)
            await this.terminateAgent()
            
            // Start a new agent and retry
            const success = await this.startAgent()
            if (success) {
              return this.streamProblem(problemText)
            } else {
              throw new Error('Agent initialization failed on retry')
            }
          }
          
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
                  if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                    this.analysis += data.choices[0].delta.content
                    // Update solution with the latest analysis
                    this.updateSolution()
                  }
                }
              } catch (e) {
                // If parsing fails, just add the raw content
                console.warn('Failed to parse streaming JSON chunk:', e)
                this.analysis += line.substring(6)
                // Update solution with the latest analysis
                this.updateSolution()
              }
            } else {
              // If not in SSE format, just add the raw text
              this.analysis += line + '\n'
              // Update solution with the latest analysis
              this.updateSolution()
            }
          }
        }
      } catch (err) {
        console.error('Error during streaming:', err)
        this.error = 'Error while solving the problem. Please try again.'
        throw err
      } finally {
        this.streaming = false
        // Final update to solution after streaming is complete
        this.updateSolution(true)
      }
    },
    
    updateSolution(isComplete = false) {
      // Parse the current analysis text into a structured solution
      // This creates a single reactive solution that updates as content arrives
      
      // Extract steps from the analysis text
      const content = this.analysis.trim()
      
      // For the single solution approach, we'll put all content into one item
      if (content) {
        this.solution = [{
          description: content,
          reasoning: '',
          calculation: '',
          final_answer: isComplete ? this.extractFinalAnswer(content) : ''
        }]
      }
    },
    
    extractFinalAnswer(content) {
      // Attempt to extract a final answer from the content
      // This is a simple implementation - might need to be more sophisticated
      const lines = content.split('\n')
      const lastLines = lines.slice(-3) // Check the last few lines
      
      for (const line of lastLines) {
        if (line.toLowerCase().includes('final answer') || 
            line.toLowerCase().includes('result') || 
            line.toLowerCase().includes('therefore')) {
          return line
        }
      }
      
      // If no final answer marker found, return the last non-empty line
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim()) {
          return lines[i]
        }
      }
      
      return ''
    },

    reset() {
      // Reset solution and analysis, but keep agent IDs
      this.analysis = ''
      this.streaming = false
      this.solution = null
      this.error = null
    },
    
    async fullReset() {
      // Full reset including agent termination
      this.reset()
      await this.terminateAgent() // This will also set agentId and runId to null
    }
  }
})
