Important: do not add <?xml version="1.0" encoding="UTF-8"?> this declaration. Follow 100% the format specified


# Prompt for LLM: Interactive 3D Atom Visualizer

**Goal:** Create an interactive 3D Atom Visualizer.

**Core Functionality:**
Develop a feature that displays interactive 3D models of chemical elements from Hydrogen (H) to Calcium (Ca).

**Visual Requirements:**

1.  **Atom Structure:** For the selected element, display a 3D model showing:
    *   A central nucleus.
    *   Distinct electron shells (or layers) orbiting the nucleus.
    *   Small electron particles orbiting within their correct shells.
2.  **Color Coding:**
    *   Assign a unique, distinct color to each electron shell (e.g., 1st shell red, 2nd shell green, 3rd shell blue).
    *   Electrons orbiting within a specific shell should visually match or correspond clearly to their shell's color.
3.  **Electron Motion:** Electrons should appear to be continuously orbiting the nucleus within their designated shell paths.

**User Interaction:**

1.  **Element Selection:** Provide a simple way for the user to select which element (from H to Ca) they want to view (e.g., a dropdown list). The visualization must update dynamically based on the user's selection.
2.  **Speed Control:** Include controls (e.g., "Slow" and "Fast" buttons) allowing the user to adjust the speed at which the electrons orbit the nucleus.
3.  **3D View Navigation:** Users must be able to interact with the 3D model using their mouse or touch gestures to rotate the view and zoom in or out.

**Information Display:**

1.  **Basic Info:** Display the Name, Chemical Symbol, and Atomic Number of the currently selected element clearly on the page.

**Technical Requirements:**

*   **Best Practices:** Follow **Vue 3 best practices**.
*   **3D Rendering:** Use **Three.js** for creating and animating the 3D scene and objects.
*   **Animation:** Utilize **Tween.js** for any smooth transitions or effects if needed. The primary electron orbiting should be continuous.
*   **State Management:** Use Pinia to manage application state (like the selected element and speed).
*   **Styling:** Use Tailwind CSS for styling the user interface.
*   **Responsiveness:** Ensure the layout works reasonably well on both desktop and mobile screens.
