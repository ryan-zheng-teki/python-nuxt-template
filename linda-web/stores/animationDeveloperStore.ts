import { defineStore } from 'pinia'

// Hardcoded URLs
const API_BASE_URL = 'http://localhost:6233'
const STREAM_BASE_URL = 'http://localhost:9233' // This URL should be used for the completion API
const ANIMATION_SERVER_URL = 'http://localhost:4000'

export const useAnimationDeveloperStore = defineStore('animationDeveloper', {
  state: () => ({
    agentId: null as string | null,
    runId: null as string | null,
    isLoading: false as boolean,
    error: null as string | null,
    animationReady: false as boolean
  }),

  actions: {
    async terminateAgent() {
      // Only attempt to terminate if we have valid agentId and runId
      if (!this.agentId || !this.runId) {
        console.log('No active animation developer agent to terminate')
        return true // Success case - nothing to terminate
      }

      try {
        console.log('Terminating animation developer agent:', this.agentId, this.runId)
        
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
          console.warn(`Animation agent termination returned status: ${response.status}`)
          // Don't throw error here, as the agent might already be terminated
        } else {
          console.log('Animation developer agent terminated successfully')
        }
        
        // Clear agent IDs regardless of success to avoid reusing terminated agents
        this.agentId = null
        this.runId = null
        
        return true
      } catch (err) {
        console.error('Error during animation agent termination:', err)
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
        
        this.isLoading = true
        this.error = null
        
        console.log('Starting animation developer agent...')
        
        const resp = await fetch(`${API_BASE_URL}/api/agents/AnimationDeveloperAgent`, {
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
        
        console.log('Animation developer agent started successfully:', this.agentId, this.runId)
        return true
      } catch (err) {
        console.error('Failed to start animation developer agent:', err)
        this.error = 'Failed to start animation generator'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async generateAnimation(problemText: string, solution: any) {
      try {
        // Make sure agent is initialized
        if (!this.agentId || !this.runId) {
          const isInitialized = await this.startAgent()
          if (!isInitialized) {
            throw new Error('Failed to initialize animation developer agent')
          }
        }

        this.isLoading = true
        this.error = null
        this.animationReady = false
        
        console.log('Generating animation for problem:', problemText)
        
        // Format the solution steps and problem for the user message
        let solutionSteps = Array.isArray(solution) ? solution : [solution];
        const finalAnswer = solutionSteps[0]?.final_answer || "";
        
        // Create a formatted message that includes both problem and solution
        // This follows the animation developer prompt expectations
        const userMessage = `
I need an animation for this geometry problem:

Problem: ${problemText}

Step-by-step solution:
${solutionSteps[0]?.description || ""}

${finalAnswer ? `Final Answer: ${finalAnswer}` : ""}
`;
        
        // Call the completions API (non-streaming version) using the correct URL structure
        const url = `${STREAM_BASE_URL}/stream/agents/AnimationDeveloperAgent/${this.agentId}/${this.runId}/chat/completions`
        
        console.log('Sending animation request to URL:', url);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: userMessage
              }
            ],
            stream: false // Not using streaming for animation developer
          })
        })
        
        if (!response.ok) {
          // If the request fails, we'll just throw an error (no retries)
          throw new Error(`Animation generation error: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('Animation generation result:', result)
        
        // Check if animation server is accessible
        try {
          const serverCheck = await fetch(ANIMATION_SERVER_URL, { 
            method: 'HEAD',
            mode: 'no-cors'  // This allows us to check if server is up without CORS issues
          })
          // If we get here, the server is responding
          console.log('Animation server is accessible')
        } catch (e) {
          console.warn('Animation server might not be running:', e)
          this.error = `Animation server not accessible. Please check if it's running on ${ANIMATION_SERVER_URL}`
          throw new Error('Animation server not accessible')
        }
        
        // Mark animation as ready
        this.animationReady = true
        
        return true
      } catch (err) {
        console.error('Error during animation generation:', err)
        this.error = err instanceof Error ? err.message : 'Failed to generate animation'
        return false
      } finally {
        this.isLoading = false
      }
    },

    getAnimationUrl() {
      return ANIMATION_SERVER_URL
    },

    reset() {
      // Reset state but keep agent IDs
      this.isLoading = false
      this.error = null
      this.animationReady = false
    },
    
    async fullReset() {
      // Full reset including agent termination
      this.reset()
      await this.terminateAgent() // This will also set agentId and runId to null
    }
  }
})
