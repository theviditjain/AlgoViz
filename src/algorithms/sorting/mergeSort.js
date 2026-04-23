// mergeSort.js
// Merge Sort uses DIVIDE & CONQUER:
//   1. Divide the array in half recursively until subarrays have 1 element
//   2. Merge sorted subarrays back together in the correct order
//
// Time: O(n log n) — best case AND worst case (consistent!)
// Space: O(n) — needs auxiliary array for merging
//
// This is fundamentally different from Bubble/Selection:
// those are "comparison and swap in place"
// Merge Sort is "split, sort halves independently, merge"

export function mergeSortSteps(array) {
  const steps = []
  const arr = [...array]

  // We track an "active range" [left, right] so the visualizer
  // can highlight which portion of the array is being worked on
  mergeSort(arr, 0, arr.length - 1, steps)

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: new Array(arr.length).fill(true),
    activeRange: [0, arr.length - 1],
    explanation: '✓ Array fully sorted!',
    detail: `Final result: [${arr.join(', ')}]`,
  })

  return steps
}

function mergeSort(arr, left, right, steps) {
  if (left >= right) return   // base case: single element is already sorted

  const mid = Math.floor((left + right) / 2)

  // SNAPSHOT: show we're dividing this range
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: new Array(arr.length).fill(false),
    activeRange: [left, right],
    dividing: [left, mid, right],   // visualizer will show the split point
    explanation: `Dividing [${arr.slice(left, right + 1).join(', ')}] at midpoint`,
    detail: `Left half: indices ${left}–${mid}, Right half: indices ${mid + 1}–${right}`,
  })

  // Recursively sort left and right halves
  mergeSort(arr, left, mid, steps)
  mergeSort(arr, mid + 1, right, steps)

  // Merge the two sorted halves
  merge(arr, left, mid, right, steps)
}

function merge(arr, left, mid, right, steps) {
  // Copy the two halves into temporary arrays
  const leftArr  = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)

  let i = 0           // pointer into leftArr
  let j = 0           // pointer into rightArr
  let k = left        // pointer into main arr (where we write)

  while (i < leftArr.length && j < rightArr.length) {
    // SNAPSHOT: comparing left[i] vs right[j]
    steps.push({
      array: [...arr],
      comparing: [left + i, mid + 1 + j],
      swapped: [],
      sorted: new Array(arr.length).fill(false),
      activeRange: [left, right],
      explanation: `Merging — comparing ${leftArr[i]} (left) vs ${rightArr[j]} (right)`,
      detail: `Is ${leftArr[i]} ≤ ${rightArr[j]}? → ${leftArr[i] <= rightArr[j] ? `Yes, place ${leftArr[i]}` : `No, place ${rightArr[j]}`}`,
    })

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i]
      i++
    } else {
      arr[k] = rightArr[j]
      j++
    }

    // SNAPSHOT: element placed at position k
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [k],
      sorted: new Array(arr.length).fill(false),
      activeRange: [left, right],
      explanation: `Placed ${arr[k]} at position ${k}`,
      detail: `Merged so far: [${arr.slice(left, k + 1).join(', ')}]`,
    })

    k++
  }

  // Copy any remaining elements from leftArr
  while (i < leftArr.length) {
    arr[k] = leftArr[i]
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [k],
      sorted: new Array(arr.length).fill(false),
      activeRange: [left, right],
      explanation: `Copying remaining left element ${arr[k]} to position ${k}`,
      detail: `No more right elements to compare against`,
    })
    i++; k++
  }

  // Copy any remaining elements from rightArr
  while (j < rightArr.length) {
    arr[k] = rightArr[j]
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [k],
      sorted: new Array(arr.length).fill(false),
      activeRange: [left, right],
      explanation: `Copying remaining right element ${arr[k]} to position ${k}`,
      detail: `No more left elements to compare against`,
    })
    j++; k++
  }

  // SNAPSHOT: this subarray [left..right] is now merged and sorted
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, idx) => idx >= left && idx <= right),
    activeRange: [left, right],
    explanation: `Subarray [${arr.slice(left, right + 1).join(', ')}] is merged and sorted`,
    detail: `Positions ${left} to ${right} are sorted`,
  })
}
