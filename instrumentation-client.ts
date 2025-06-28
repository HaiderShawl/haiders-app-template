import posthog from "posthog-js"

// Initialize PostHog on the client side
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  capture_pageview: "history_change", // Tracks page views on history changes
  capture_pageleave: true, // Enable pageleave capture
  capture_exceptions: true, // Enable capturing exceptions via Error Tracking
  debug: process.env.NODE_ENV === "development"
})
