// binarySearch.js
// Binary Search works on a SORTED array.
// It repeatedly halves the search space by comparing the target
// with the middle element:
//   - target == mid  → found!
//   - target < mid   → search left half
//   - target > mid   → search right half
//
// Time: O(log n) — halves the problem every step. 1 billion elements = ~30 steps!
// Space: O(1) — no extra memory needed
//
// REQUIRES: array must be sorted. We auto-sort the input before searching.

export function binarySearchSteps(array, target) {
  const steps = []
  
  // Binary search requires sorted array
  const arr = [...array].sort((a, b) => a - b)

  steps.push({
    array: [...arr],
    low: 0,
    high: arr.length - 1,
    mid: -1,
    found: -1,
    eliminated: [],
    target,
    explanation: `Searching for ${target} in sorted array`,
    detail: `Array auto-sorted. Search space: entire array [0..${arr.length - 1}]`,
  })

  let low = 0
  let high = arr.length - 1
  const eliminated = new Set()   // indices we've ruled out

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    // SNAPSHOT: show the current low/mid/high state
    steps.push({
      array: [...arr],
      low,
      high,
      mid,
      found: -1,
      eliminated: [...eliminated],
      target,
      explanation: `Checking middle element: arr[${mid}] = ${arr[mid]}`,
      detail: `Search window: [${low}..${high}], Mid = ${mid}, Target = ${target}`,
    })

    if (arr[mid] === target) {
      // SNAPSHOT: found!
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        found: mid,
        eliminated: [...eliminated],
        target,
        explanation: `✓ Found ${target} at index ${mid}!`,
        detail: `It took ${steps.length} steps. Linear search would take up to ${arr.length} steps.`,
      })
      return steps
    }

    if (arr[mid] < target) {
      // Eliminate everything from low to mid (too small)
      for (let i = low; i <= mid; i++) eliminated.add(i)

      steps.push({
        array: [...arr],
        low: mid + 1,
        high,
        mid,
        found: -1,
        eliminated: [...eliminated],
        target,
        explanation: `${arr[mid]} < ${target} → eliminate left half`,
        detail: `Left half [${low}..${mid}] is too small. New search window: [${mid + 1}..${high}]`,
      })
      low = mid + 1
    } else {
      // Eliminate everything from mid to high (too large)
      for (let i = mid; i <= high; i++) eliminated.add(i)

      steps.push({
        array: [...arr],
        low,
        high: mid - 1,
        mid,
        found: -1,
        eliminated: [...eliminated],
        target,
        explanation: `${arr[mid]} > ${target} → eliminate right half`,
        detail: `Right half [${mid}..${high}] is too large. New search window: [${low}..${mid - 1}]`,
      })
      high = mid - 1
    }
  }

  // Not found
  steps.push({
    array: [...arr],
    low,
    high,
    mid: -1,
    found: -2,   // -2 = "not found" signal
    eliminated: [...Array(arr.length).keys()],
    target,
    explanation: `✗ ${target} not found in array`,
    detail: `Search space exhausted. ${target} does not exist in this array.`,
  })

  return steps
}
