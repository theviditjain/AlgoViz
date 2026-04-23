// useStepEngine.js
// This hook is the "playback engine" of the entire app.
// It holds the current step index and provides controls to
// move forward, backward, auto-play, and change speed.
//
// Think of it like a video player — but instead of frames,
// the "frames" are snapshots of the algorithm's state.

import { useState, useEffect, useRef, useCallback } from 'react'

export function useStepEngine(steps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)   // milliseconds between auto steps
  const intervalRef = useRef(null)

  // When steps change (user switched algo or changed array), reset to start
  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [steps])

  // Auto-play: advance one step every `speed` ms
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)   // stop when we hit the last step
            return prev
          }
          return prev + 1
        })
      }, speed)
    }
    // Cleanup: clear interval when paused or unmounted
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, steps.length])

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1)
  }, [currentStep, steps.length])

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(c => c - 1)
  }, [currentStep])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    // If we're at the last step and user hits play, restart from beginning
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(p => !p)
    }
  }, [currentStep, steps.length])

  return {
    currentStep,
    step: steps[currentStep] || steps[0],   // current snapshot
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    next,
    prev,
    reset,
    togglePlay,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    progress: steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0,
  }
}
