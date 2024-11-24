import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BudgetProvider } from './context/BudgetContext.tsx' // El provider es lo que contiene los datos y el context solamente lo genera. Usamos ese BudgetProvider para rodear nuestra aplicación y de esa forma ya lo tenemos de forma global y vamos a poder usar nuestro state teniendo una sola instancia sin tener que hacerlo por via props como lo hemos estado haciendo en los demás proyectos.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </React.StrictMode>,
)
