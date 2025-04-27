import os
import json
import logging
import sys
from typing import Dict, List, Optional, Any
from datetime import timedelta
from pydantic import BaseModel
from restack_ai.agent import agent, import_functions, NonRetryableError

# Create a logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

with import_functions():
    from linda_server.functions.llm_chat import Message, LlmChatInput, llm_chat
    from linda_server.utils.animation_parser import parse_animation_code, save_animation_files

class GeometryStepSolution(BaseModel):
    steps: List[Dict[str, str]]
    final_answer: str

class AnimationInput(BaseModel):
    problem_text: str
    solution: GeometryStepSolution

class AnimationDeveloperResponse(BaseModel):
    status: str
    message: str
    animation_code: Optional[str] = None

@agent.defn()
class AnimationDeveloperAgent:
    def __init__(self) -> None:
        logger.info("Initializing AnimationDeveloperAgent")
        self.animation_code = None
        self.status = "idle"
        self.animation_dir = os.path.join("python-nuxt-template", "animation_server")
        
    @agent.event
    async def create_animation(self, input: AnimationInput) -> AnimationDeveloperResponse:
        logger.info(f"Animation Developer received problem: {input.problem_text}")
        logger.info("Input payload: %s", input.json())
        self.status = "creating"
        
        try:
            # First, generate the animation plan based on the solution steps
            logger.info("Generating animation plan")
            system_content = """
            You are an expert ThreeJS and TweenJS animation developer specialized in creating educational animations for a Nuxt.js application. Your task is to create step-by-step animations for geometric problems.

            **IMPORTANT CONTEXT ABOUT THE EXISTING APPLICATION:**
            The animation will be integrated into an existing Nuxt.js application with the following structure:
            1. The application uses Nuxt 3.x with Vue 3 composition API
            2. The application uses TypeScript
            3. State management is handled through Pinia stores
            4. Styling is done with Tailwind CSS
            5. The application has FontAwesome integration
            6. All core infrastructure files are ALREADY SET UP, including:
               - nuxt.config.ts
               - app.vue
               - tailwind.config.js
               - package.json with all dependencies
               - All plugin configurations
            
            **LIBRARY IMPORTS:**
            You MUST use the following import syntax for Three.js and Tween.js:
            ```typescript
            import * as THREE from 'three';
            import * as TWEEN from '@tweenjs/tween.js';
            ```
            
            **YOUR SPECIFIC TASK:**
            You should ONLY create the following files:
            1. A Vue component for the animation (e.g., `/pages/geometry-animation.vue` or `/components/GeometryAnimation.vue`)
            2. A Pinia store for animation state management (e.g., `/stores/animationStore.ts`)
            3. Any necessary utility files for the animation (e.g., `/utils/geometry-helpers.ts`)
            
            **DO NOT CREATE:**
            1. Any infrastructure files like nuxt.config.ts, app.vue, main.ts, tailwind.config.js
            2. Any package.json or dependency configuration
            3. Any plugin setup files
            
            **TECHNICAL REQUIREMENTS:**
            * Use TypeScript for all files
            * Follow Vue 3 composition API best practices
            * Use Three.js for 3D rendering
            * Use Tween.js for animations
            * Use Pinia for state management
            * Use Tailwind CSS for styling the UI
            * Ensure the layout is responsive
            
            For the geometry problem, follow these rules:
            1. First, analyze the geometry problem and its solution steps
            2. For each step, design a clear visual animation that illustrates the concept
            3. Use ThreeJS for 3D rendering and TweenJS for smooth animations
            4. Create a timeline that progresses through each step when the user clicks "Next"
            5. Include clear labels for key points, lines, angles, etc.
            6. Use intuitive colors (e.g., highlighted elements in focus)
            
            Your final output should be complete, production-ready TypeScript Vue component files that can be directly integrated into the existing Nuxt.js application.
            """
            
            # Generate the animation plan
            plan_messages = [
                Message(role="system", content=system_content),
                Message(role="user", content=f"""
                Create an animation plan for this geometry problem:
                
                Problem: {input.problem_text}
                
                Solution steps:
                {json.dumps(input.solution.steps, indent=2)}
                
                Final answer: {input.solution.final_answer}
                
                Describe how you would animate each step using ThreeJS and TweenJS, 
                following the technical requirements I provided.
                """)
            ]
            
            animation_plan = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=plan_messages),
                start_to_close_timeout=timedelta(seconds=180),
            )
            logger.info("Received animation plan")
            
            # Now generate the actual code based on the plan
            logger.info("Generating animation code from plan")
            code_messages = [
                Message(role="system", content=system_content),
                Message(role="user", content=f"""
                Generate complete, production-ready TypeScript code based on this animation plan:
                
                Problem: {input.problem_text}
                
                Solution steps:
                {json.dumps(input.solution.steps, indent=2)}
                
                Final answer: {input.solution.final_answer}
                
                Animation plan:
                {animation_plan}
                
                The code should:
                1. Be ready to integrate into the existing Nuxt.js TypeScript application
                2. Include ONLY the necessary Vue components, Pinia stores, and utility files
                3. Have clear step navigation UI (Previous/Next buttons)
                4. Include all animation logic for each step
                5. Be well-commented for maintenance
                6. Follow Vue 3 composition API best practices with TypeScript
                7. Use Pinia for state management
                8. Use Tailwind CSS for styling
                9. Be responsive for both desktop and mobile
                
                REMEMBER to use the required import syntax for Three.js and Tween.js:
                ```typescript
                import * as THREE from 'three';
                import * as TWEEN from '@tweenjs/tween.js';
                ```
                
                DO NOT create any infrastructure files (nuxt.config.ts, app.vue, etc.) as they already exist.
                FOCUS ONLY on creating the necessary components, stores, and utilities for the animation.
                
                Format your response with file paths and their complete contents like this:
                
                File: pages/geometry-animation.vue
                ```vue
                <!-- Vue component code here -->
                ```
                
                File: stores/animationStore.ts
                ```ts
                // Pinia store code here
                ```
                
                Provide the complete code for each file.
                """)
            ]
            
            animation_code = await agent.step(
                function=llm_chat,
                function_input=LlmChatInput(messages=code_messages),
                start_to_close_timeout=timedelta(seconds=240),  # Longer timeout for code generation
            )
            logger.info("Received animation code block")
            
            # Save the animation code to files using the utility functions
            logger.info("Saving animation code to files")
            parsed_files = parse_animation_code(animation_code)
            save_animation_files(self.animation_dir, parsed_files)
            
            self.animation_code = animation_code
            self.status = "complete"
            logger.info("create_animation completed successfully")
            
            return AnimationDeveloperResponse(
                status=self.status,
                message="Animation created successfully",
                animation_code=self.animation_code
            )
            
        except Exception as e:
            logger.exception("Error in create_animation")
            self.status = "error"
            raise NonRetryableError(f"Error in animation developer agent: {e}") from e

    @agent.run
    async def run(self, function_input: Dict[str, Any]) -> None:
        logger.info("AnimationDeveloperAgent run started")
        logger.info("Run input: %s", function_input)
        await agent.condition(lambda: False)
