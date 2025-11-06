import React, { useState } from 'react'

/**
 * SearchBar Component
 * 
 * CONCEPT: Create Components - A reusable search input component that handles user input for city searches.
 * This demonstrates component composition and the separation of concerns.
 * 
 * CONCEPT: useState - Manages the search query input state locally within this component.
 * Local state is appropriate here since only this component needs to track the input value.
 * 
 * CONCEPT: Passing Props - Receives 'onSearch' function as a prop from parent component (Homepage).
 * This allows the child component to communicate back to the parent when a search is performed.
 * 
 * @param {Function} onSearch - Callback function passed from parent to handle search execution
 */
export default function SearchBar({ onSearch }) {
  // CONCEPT: useState - Managing local component state for the search input
  // This is internal state that doesn't need to be shared with other components
  const [query, setQuery] = useState('')

  /**
   * Handle search button click
   * Validates input and calls parent's onSearch function
   */
  const handleSearch = () => {
    // Input validation - only search if there's actual text (not just whitespace)
    if (query.trim()) onSearch(query)
  }

  /**
   * Handle Enter key press for better UX
   * Allows users to search by pressing Enter instead of clicking button
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="search-container">
      <div className="search-wrapper">
        {/* 
          CONCEPT: useState in Action - Controlled input component
          - value={query} makes this a controlled component (React controls the value)
          - onChange updates state when user types, triggering re-render
          - This pattern ensures React state is the single source of truth
        */}
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city or state..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {/* 
          Event handler that calls our local handleSearch function
          which then calls the parent's onSearch prop function
        */}
        <button className="search-btn" onClick={handleSearch}>
          Search 🔍
        </button>
      </div>
    </div>
  )
}
