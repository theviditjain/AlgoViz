// bubbleSort.js
// Bubble Sort works by repeatedly comparing adjacent elements and swapping
// if they're in the wrong order. After each full pass, the largest unsorted
// element "bubbles up" to its correct position at the end.
//
// This function doesn't just run the sort — it RECORDS every comparison
// and swap as a "step snapshot". The visualizer plays through these snapshots.

export function bubbleSortSteps(array) {
  const steps = []
  const arr = [...array]       // never mutate the original
  const n = arr.length
  const sorted = new Array(n).fill(false)  // tracks which positions are finalized

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {

      // SNAPSHOT: before we decide — record the comparison
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],   // these two bars will glow cyan
        swapped: [],
        sorted: [...sorted],
        explanation: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        detail: `Is ${arr[j]} > ${arr[j + 1]}? → ${arr[j] > arr[j + 1] ? 'Yes, swap!' : 'No, move on.'}`,
      })

      if (arr[j] > arr[j + 1]) {
        // swap
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

        // SNAPSHOT: after swap — record the new state
        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],   // these two bars will flash orange
          sorted: [...sorted],
          explanation: `Swapped! ${arr[j + 1]} moved right, ${arr[j]} moved left`,
          detail: `Array is now: [${arr.join(', ')}]`,
        })
      }
    }

    // After each outer pass, the rightmost unsorted element is in its final spot
    sorted[n - 1 - i] = true
  }
  sorted[0] = true  // last remaining element is also sorted

  // Final snapshot — everything done
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: new Array(n).fill(true),
    explanation: '✓ Array fully sorted!',
    detail: `Final result: [${arr.join(', ')}]`,
  })

  return steps
}
