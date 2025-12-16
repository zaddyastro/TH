import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const style = document.createElement("style");
style.innerHTML = `
@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
}
.heart {
  position: fixed;
  bottom: -20px;
  font-size: 20px;
  animation: floatUp 6s linear forwards;
  pointer-events: none;
}
`;
document.head.appendChild(style);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
