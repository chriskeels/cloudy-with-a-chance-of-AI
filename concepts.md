# React & JavaScript Concepts Guide

This document explains core React and JavaScript concepts used throughout the bc-app codebase, with practical examples from the project.

---

## 1. Create Components

**What it is:** A component is a reusable, self-contained piece of UI in React. Components are JavaScript functions (or classes) that return JSX—a syntax that looks like HTML but is actually JavaScript.

**Why it matters:** Components let you break complex UIs into smaller, manageable pieces. Instead of one giant file, you have many small components that can be tested, reused, and understood independently.

**How to create one:**
```jsx
// Functional component (modern approach)
function MyComponent() {
  return <div>Hello World</div>;
}

// Arrow function component (also common)
const MyComponent = () => {
  return <div>Hello World</div>;
};

// Export so other files can use it
export default MyComponent;
```

**Real example from bc-app:**
```jsx
// src/components/Button.jsx
const Button = ({ onClick, children, variant = "primary" }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

**Where to find it:** `src/components/Button.jsx`, `src/components/Card.jsx`, `src/pages/Home.jsx`

---

## 2. Hooks

**What it is:** Hooks are special React functions that let you "hook into" React features like state, lifecycle events, and context from functional components. They always start with `use` (e.g., `useState`, `useEffect`, `useContext`).

**Why it matters:** Before hooks, you needed class components to use state and lifecycle methods. Hooks make functional components just as powerful but simpler and more composable.

**Rules of hooks:**
- Only call hooks at the top level (not inside loops, conditions, or nested functions)
- Only call hooks from React functions (components or custom hooks)

**Common built-in hooks:**
- `useState` — manage component state
- `useEffect` — perform side effects (API calls, subscriptions, DOM updates)
- `useContext` — access shared context data
- `useRef` — persist values across renders without causing re-renders
- `useMemo` / `useCallback` — optimize performance by memoizing values/functions

**Custom hook example:**
```jsx
// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

**Where to find it:** Any component using `useState`, `useEffect`, etc. (e.g., `src/pages/Resume.jsx`, `src/pages/Quiz.jsx`)

---

## 3. useState

**What it is:** A React hook that lets you add state (data that can change) to a functional component. Returns an array with two items: the current state value and a function to update it.

**Why it matters:** Without state, components are static. `useState` makes components interactive—tracking user input, toggle states, counters, form data, etc.

**Syntax:**
```jsx
const [stateValue, setStateValue] = useState(initialValue);
```

**Example:**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // Initial value is 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Real example from bc-app:**
```jsx
// src/pages/Resume.jsx (simplified)
const Resume = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // ...generate preview
  };

  // ...rest of component
};
```

**Key points:**
- State updates trigger re-renders
- State updates are asynchronous
- Use functional updates when new state depends on old state: `setCount(prev => prev + 1)`

**Where to find it:** `src/pages/Resume.jsx`, `src/pages/Quiz.jsx`, `src/pages/Home.jsx`

---

## 4. useEffect

**What it is:** A React hook that runs side effects (code that interacts with the outside world) after the component renders. Side effects include API calls, subscriptions, timers, DOM manipulation, and localStorage updates.

**Why it matters:** Components need to do more than just render UI—they need to fetch data, sync with external systems, and clean up resources. `useEffect` handles all of this in a predictable way.

**Syntax:**
```jsx
useEffect(() => {
  // Side effect code runs after render
  
  return () => {
    // Optional cleanup function runs before next effect or unmount
  };
}, [dependencies]); // Re-run effect when these values change
```

**Dependency array behavior:**
- `[]` (empty) — run once after initial render (like `componentDidMount`)
- `[dep1, dep2]` — run after initial render AND whenever `dep1` or `dep2` changes
- No array — run after every render (usually a mistake!)

**Example 1: Fetch data on mount**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Re-fetch when userId changes

  return <div>{user?.name}</div>;
}
```

**Example 2: Cleanup with subscriptions**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup: clear timer when component unmounts
  return () => clearInterval(timer);
}, []);
```

**Real example from bc-app:**
```jsx
// src/pages/Home.jsx (simplified)
useEffect(() => {
  // Load saved resume reviews from localStorage
  const savedReviews = JSON.parse(localStorage.getItem('resumeReviews') || '[]');
  if (savedReviews.length > 0) {
    setResumeScore(savedReviews[0].score);
  }

  // Load completed quizzes
  const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
  setQuizHistory(completedQuizzes);
}, []); // Run once on mount
```

**Where to find it:** `src/pages/Home.jsx`, `src/pages/Resume.jsx`, `src/pages/Profile.jsx`

---

## 5. Context API

**What it is:** React's built-in solution for sharing data across multiple components without passing props through every level of the component tree. Context creates a "global" store accessible to any component that opts in.

**Why it matters:** Solves "prop drilling" (passing props through many intermediate components). Ideal for app-wide data like user authentication, theme settings, or language preferences.

**How it works:**
1. Create a context with `createContext()`
2. Wrap components with a `Provider` that supplies the value
3. Consume the value with `useContext()` in any child component

**Example:**
```jsx
// 1. Create context
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

// 2. Create provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Custom hook for consuming context
export function useUser() {
  return useContext(UserContext);
}

// 4. Use in App.jsx
function App() {
  return (
    <UserProvider>
      <Header />
      <Dashboard />
    </UserProvider>
  );
}

// 5. Consume in any component
function Header() {
  const { user, setUser } = useUser();
  return <div>Hello, {user?.name}!</div>;
}
```

**When to use Context:**
- User authentication state
- Theme (dark mode / light mode)
- Language / i18n settings
- Global app config

**When NOT to use Context:**
- Frequent updates (causes all consumers to re-render)
- Simple parent-child data flow (use props instead)
- Complex state logic (consider Redux, Zustand, or Jotai)

**Note:** bc-app currently doesn't use Context API because state is mostly page-local or stored in localStorage. If you added user authentication or a theme switcher, Context would be ideal.

**Where to implement it:** Create `src/context/UserContext.jsx` or `src/context/ThemeContext.jsx` if needed

---

## 6. Passing Props

**What it is:** Props (short for "properties") are arguments passed from a parent component to a child component. They're like function parameters but for React components.

**Why it matters:** Props enable component composition and reusability. A `<Button>` can display different text, colors, and behaviors based on the props you pass to it.

**Syntax:**
```jsx
// Parent component
<ChildComponent name="Alice" age={25} isActive={true} />

// Child component
function ChildComponent({ name, age, isActive }) {
  return <div>{name} is {age} years old</div>;
}

// Or access via props object
function ChildComponent(props) {
  return <div>{props.name} is {props.age} years old</div>;
}
```

**Prop types:**
- **Strings:** `name="Alice"`
- **Numbers/Booleans/Objects:** `age={25}` `isActive={true}` `user={{id: 1}}`
- **Functions:** `onClick={handleClick}`
- **Children:** `<Button>Click me</Button>` (accessed via `props.children`)

**Real example from bc-app:**
```jsx
// src/pages/Home.jsx passing props to Card
<Card 
  title="Resume Score" 
  score={resumeScore} 
  maxScore={100}
  onClick={() => navigate('/resume')}
/>

// src/components/Card.jsx receiving props
const Card = ({ title, score, maxScore, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{score} / {maxScore}</p>
    </div>
  );
};
```

**Props are read-only:** Components must never modify their own props. If you need to change a value, use state.

**Default props:**
```jsx
const Button = ({ variant = "primary", children }) => {
  // variant defaults to "primary" if not provided
};
```

**Where to find it:** Every component interaction—`src/components/Button.jsx`, `src/components/Card.jsx`, `src/pages/Home.jsx`

---

## 7. Lifting State

**What it is:** Moving state from a child component up to a parent component so multiple children can share and modify the same state.

**Why it matters:** When two or more sibling components need to share data or stay in sync, the state must live in their common parent. The parent then passes the state down as props and passes updater functions to let children modify it.

**Example without lifting (broken):**
```jsx
// ❌ Each component has its own count—they don't sync
function CounterA() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>A: {count}</button>;
}

function CounterB() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>B: {count}</button>;
}
```

**Example WITH lifting (correct):**
```jsx
// ✅ State lives in parent, shared by both children
function Parent() {
  const [count, setCount] = useState(0); // State lifted here

  return (
    <div>
      <CounterA count={count} setCount={setCount} />
      <CounterB count={count} setCount={setCount} />
      <p>Total: {count}</p>
    </div>
  );
}

function CounterA({ count, setCount }) {
  return <button onClick={() => setCount(count + 1)}>A: {count}</button>;
}

function CounterB({ count, setCount }) {
  return <button onClick={() => setCount(count + 1)}>B: {count}</button>;
}
```

**Real-world scenario from bc-app:**
Imagine if `Home.jsx` displayed quiz score and `CompletedQuizzes.jsx` displayed quiz history. When a user completes a new quiz:
1. The quiz state lives in `Quiz.jsx` (parent or app-level)
2. `Quiz.jsx` passes the quiz list to `CompletedQuizzes` as a prop
3. `Quiz.jsx` passes the latest score to `Home` as a prop
4. When a new quiz is completed, `Quiz.jsx` updates state → both children re-render with new data

**When to lift state:**
- Two siblings need to share data
- Parent needs to orchestrate interactions between children
- Multiple components need to read/write the same value

**Where to find it:** `src/pages/Profile.jsx` loads quiz/resume history and passes it to `CompletedQuizzes` and `ResumeScoreHistory` components

---

## 8. API Calls

**What it is:** Requests made from the browser to a server to fetch or send data. In React, API calls are typically made with `fetch()`, `axios`, or other HTTP libraries inside `useEffect` or event handlers.

**Why it matters:** Modern apps are data-driven. API calls let you load user data, submit forms, fetch search results, or integrate with third-party services (like OpenAI in bc-app).

**Where to make API calls:**
- **On mount:** Use `useEffect` with empty dependency array
- **On user action:** Call inside event handlers (button click, form submit)
- **On prop change:** Use `useEffect` with dependencies

**Example with fetch:**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.example.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div>{user.name}</div>;
}
```

**Example with async/await:**
```jsx
useEffect(() => {
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.example.com/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [userId]);
```

**Real example from bc-app:**
```jsx
// src/services/openAPI.js
export async function analyzeResume(resumeText) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a resume expert...' },
        { role: 'user', content: resumeText }
      ]
    })
  });

  const data = await response.json();
  return parseResumeResponse(data);
}

// src/pages/Resume.jsx
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const results = await analyzeResume(extractedText);
    setResults(results);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Best practices:**
- Always handle loading and error states
- Clean up with AbortController if component might unmount mid-request
- Extract API logic into service files (like `src/services/openAPI.js`)
- Use environment variables for API keys (never hardcode secrets!)

**Where to find it:** `src/services/openAPI.js`, `src/services/resumeReview.js`, `src/pages/Resume.jsx`

---

## 9. Prop Drilling

**What it is:** Passing props through multiple layers of components, even when intermediate components don't need the data themselves. They just act as "middlemen" to get data to deeply nested children.

**Why it's a problem:** Makes code harder to maintain, clutters intermediate components with props they don't use, and tightly couples your component tree.

**Example of prop drilling:**
```jsx
// ❌ Prop drilling: UserProfile doesn't use 'theme', just passes it down
function App() {
  const [theme, setTheme] = useState('dark');
  return <UserProfile theme={theme} />;
}

function UserProfile({ theme }) {
  // UserProfile doesn't use theme, just passes it
  return <Settings theme={theme} />;
}

function Settings({ theme }) {
  // Settings doesn't use theme either
  return <ThemeToggle theme={theme} />;
}

function ThemeToggle({ theme }) {
  // Finally used here!
  return <button>{theme}</button>;
}
```

**Solutions:**

### Solution 1: Context API (best for global data)
```jsx
// ✅ Context API eliminates drilling
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <UserProfile />
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const theme = useContext(ThemeContext);
  return <button>{theme}</button>;
}
```

### Solution 2: Component composition (best for local data)
```jsx
// ✅ Pass the component directly instead of drilling props
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <UserProfile>
      <ThemeToggle theme={theme} />
    </UserProfile>
  );
}

function UserProfile({ children }) {
  return <div className="profile">{children}</div>;
}
```

### Solution 3: State management library (for complex apps)
```jsx
// ✅ Zustand, Redux, or Jotai for complex shared state
import { create } from 'zustand';

const useStore = create((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme })
}));

function ThemeToggle() {
  const { theme, setTheme } = useStore();
  return <button onClick={() => setTheme('light')}>{theme}</button>;
}
```

**When prop drilling is actually fine:**
- Only 1-2 levels deep
- Props are specific to the component tree (not global)
- The intermediate components are unlikely to change

**Where to watch for it in bc-app:**
Currently bc-app is small enough that prop drilling isn't a major issue. If you add user authentication and need to pass `user` to many components, consider Context API.

---

## Quick Reference Table

| Concept | Use Case | Example in bc-app |
|---------|----------|-------------------|
| **Components** | Build reusable UI pieces | `Button.jsx`, `Card.jsx` |
| **Hooks** | Add React features to functions | All pages use hooks |
| **useState** | Track changing data | Quiz answers, resume file |
| **useEffect** | Fetch data, sync with localStorage | Load quiz history on mount |
| **Context API** | Share global data | (Not yet used—good for auth) |
| **Props** | Pass data parent → child | `Home.jsx` → `Card` |
| **Lifting State** | Share state between siblings | Quiz results → history + dashboard |
| **API Calls** | Fetch/send server data | OpenAI resume analysis |
| **Prop Drilling** | (Anti-pattern to avoid) | Pass data through many layers |

---

## Next Steps

- **Practice:** Try converting a prop-drilled component to use Context API
- **Experiment:** Build a custom hook (e.g., `useResume()` to encapsulate resume logic)
- **Refactor:** Look for opportunities to lift state or eliminate prop drilling
- **Learn more:** Explore advanced hooks like `useReducer`, `useMemo`, `useCallback`

For detailed code examples, explore the files mentioned in each section.
