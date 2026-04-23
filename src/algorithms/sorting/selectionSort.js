// selectionSort.js
// Selection Sort works by scanning the unsorted portion of the array to find
// the minimum element, then placing it at the start of the unsorted portion.
// After each pass, the sorted portion grows by 1 from the left.

export function selectionSortSteps(array) {
  const steps = []
  const arr = [...array]
  const n = arr.length
  const sorted = new Array(n).fill(false)

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i  // assume the first unsorted element is the minimum

    for (let j = i + 1; j < n; j++) {

      // SNAPSHOT: scanning to find the true minimum
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],     // current minimum vs challenger
        swapped: [],
        sorted: [...sorted],
        minIndex: minIdx,           // we'll highlight the current minimum differently
        scanStart: i,
        explanation: `Scanning for minimum — comparing ${arr[minIdx]} (current min) vs ${arr[j]}`,
        detail: `Is ${arr[j]} < ${arr[minIdx]}? → ${arr[j] < arr[minIdx] ? `Yes! New minimum: ${arr[j]}` : 'No. Keep current minimum.'}`,
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j   // found a new minimum
      }
    }

    // Place the minimum at position i
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [i, minIdx],
        sorted: [...sorted],
        minIndex: i,
        scanStart: i,
        explanation: `Placed minimum ${arr[i]} at position ${i}`,
        detail: `Swapped positions ${i} and ${minIdx}. Array: [${arr.join(', ')}]`,
      })
    } else {
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: [...sorted],
        minIndex: i,
        scanStart: i,
        explanation: `${arr[i]} is already in the right place`,
        detail: `No swap needed for position ${i}`,
      })
    }

    sorted[i] = true
  }
  sorted[n - 1] = true

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
