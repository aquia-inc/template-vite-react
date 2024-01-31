/**
 * The entry point for application
 * @module main
 */
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import CONFIG from '@/utils/config'
import router from '@/router/router'
import onPerfEntry from '@/utils/onPerfEntry'
import { SIGN_IN_GREETING } from '@/locales/en'
import '@/sass/style.scss'

// IIFE that initializes the root node and renders the application.
;(async function () {
  // create the root element in the DOM
  const rootElement = document.getElementById('root') as HTMLElement

  // create the React root node and render the application
  ReactDOMClient.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )

  // if NODE_ENV is production, return early. otherwise, run dev tools.
  if (process.env.NODE_ENV === 'development') {
    console.debug(SIGN_IN_GREETING, CONFIG)

    // enable React performance measurement tools.
    // see https://create-react-app.dev/docs/measuring-performance/
    const { onCLS, onFID, onFCP, onINP, onLCP, onTTFB } = await import(
      'web-vitals'
    )

    onCLS(onPerfEntry)
    onFID(onPerfEntry)
    onFCP(onPerfEntry)
    onINP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
})()
