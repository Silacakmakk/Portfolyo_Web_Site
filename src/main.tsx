import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/bodoni-moda/latin-400.css'
import '@fontsource/bodoni-moda/latin-ext-400.css'
import '@fontsource/bodoni-moda/latin-400-italic.css'
import '@fontsource/bodoni-moda/latin-ext-400-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import './styles/global.css'
import { NavigationProvider } from './app/NavigationContext'
import { App } from './app/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><NavigationProvider><App /></NavigationProvider></React.StrictMode>,
)
