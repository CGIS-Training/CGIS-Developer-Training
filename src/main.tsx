import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// This line chooses what the app shows. To switch, change the folder in it and save.
//   './labs/day1/App'        your work for Day 1
//   './solutions/day1/App'   the finished Day 1 lab, once you have it
// For another day, change the number: './labs/day2/App'
// import App from './labs/day1/App'
import App from './labs/day3/App'

// The starting point: puts our App component on the page, inside the "root" element in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
