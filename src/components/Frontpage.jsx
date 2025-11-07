 import { useNavigate } from "react-router-dom"

/**
 * Frontpage Component
 * 
 * CONCEPT: Create Components - A functional component that serves as the landing page for the weather app.
 * Components are reusable, self-contained pieces of UI that return JSX.
 * 
 * CONCEPT: Hooks - Uses the useNavigate hook from React Router to programmatically navigate between pages.
 * Hooks let you "hook into" React features from functional components. They always start with "use".
 * 
 * This component demonstrates:
 * - Component creation with arrow function syntax
 * - Event handlers for button clicks
 * - Programmatic navigation using React Router
 */
export default function Frontpage() {
    // CONCEPT: Hooks - useNavigate hook provides navigation functionality
    // This hook returns a function that can be called to navigate to different routes
    const navigate = useNavigate()

  return (
    <div className="frontpage-container">
      <section className="frontpage-section">
        <h1 className="frontpage-title">
          Welcome to Cloudy with a chance of AI
        </h1>

        <p className="frontpage-subtext">weather app</p>

        <div className="frontpage-buttons">
          {/* 
            Event handler example - onClick prop receives a function that runs when button is clicked.
            This demonstrates passing functions as props and handling user interactions.
          */}
          <button
            type="button"
            aria-label="Sign in or Sign up"
            onClick={() => console.log("Sign in / Sign up clicked")}
            className="frontpage-btn primary-btn"
          >
            Sign in / Sign up
          </button>

          {/* 
            CONCEPT: Hooks in Action - Using the navigate function from useNavigate hook
            to programmatically change routes when user clicks the button
          */}
          <button
            type="button"
            aria-label="Continue without signing in"
            onClick={() =>  navigate("/Homepage")}
            className="frontpage-btn secondary-btn"
          >
            Continue without signing up/in
          </button>
        </div>

        <p className="frontpage-footer">By continuing you agree to our terms and privacy policy.</p>
      </section>
    </div>
  )
}
