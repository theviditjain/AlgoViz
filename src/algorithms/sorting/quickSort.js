// quickSort.js
// Quick Sort picks a PIVOT element and partitions the array so that:
//   - Everything LEFT of pivot is smaller than pivot
//   - Everything RIGHT of pivot is larger than pivot
// Then recursively sorts both sides.
//
// Time: O(n log n) average, O(n²) worst case (bad pivot choices)
// Space: O(log n) — recursion stack only, sorts IN PLACE (no aux array!)
//
// We use "last element as pivot" strategy here (classic Lomuto partition)

export function quickSortSteps(array) {
  const steps = []
  const arr = [...array]

  quickSort(arr, 0, arr.length - 1, steps)

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    pivot: -1,
    sorted: new Array(arr.length).fill(true),
    activeRange: [0, arr.length - 1],
    explanation: '✓ Array fully sorted!',
    detail: `Final result: [${arr.join(', ')}]`,
  })

  return steps
}

function quickSort(arr, low, high, steps) {
  if (low >= high) return

  // Partition and get pivot's final position
  const pivotIdx = partition(arr, low, high, steps)

  // Recursively sort elements before and after pivot
  quickSort(arr, low, pivotIdx - 1, steps)
  quickSort(arr, pivotIdx + 1, high, steps)
}

function partition(arr, low, high, steps) {
  const pivotValue = arr[high]   // always pick last element as pivot

  // SNAPSHOT: announce the pivot
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    pivot: high,
    activeRange: [low, high],
    sorted: new Array(arr.length).fill(false),
    explanation: `Pivot selected: ${pivotValue} (at index ${high})`,
    detail: `Will partition [${arr.slice(low, high + 1).join(', ')}] around ${pivotValue}`,
  })

  let i = low - 1   // i tracks the "boundary" of elements smaller than pivot

  for (let j = low; j < high; j++) {
    // SNAPSHOT: compare current element with pivot
    steps.push({
      array: [...arr],
      comparing: [j, high],
      swapped: [],
      pivot: high,
      activeRange: [low, high],
      sorted: new Array(arr.length).fill(false),
      explanation: `Is ${arr[j]} ≤ pivot (${pivotValue})?`,
      detail: `${arr[j]} ≤ ${pivotValue} → ${arr[j] <= pivotValue ? 'Yes! Extend left partition' : 'No. Leave in right partition'}`,
    })

    if (arr[j] <= pivotValue) {
      i++
      // Swap arr[i] and arr[j] — extend the "less than pivot" region
      ;[arr[i], arr[j]] = [arr[j], arr[i]]

      if (i !== j) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [i, j],
          pivot: high,
          activeRange: [low, high],
          sorted: new Array(arr.length).fill(false),
          explanation: `Swapped ${arr[j]} and ${arr[i]} — extending left partition`,
          detail: `Left partition (≤ ${pivotValue}): [${arr.slice(low, i + 1).join(', ')}]`,
        })
      }
    }
  }

  // Place pivot in its correct final position
  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
  const pivotFinalIdx = i + 1

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [pivotFinalIdx, high],
    pivot: pivotFinalIdx,
    activeRange: [low, high],
    sorted: arr.map((_, idx) => idx === pivotFinalIdx),  // pivot is now in final position
    explanation: `Pivot ${pivotValue} placed at its final position (index ${pivotFinalIdx})`,
    detail: `Left: [${arr.slice(low, pivotFinalIdx).join(', ')}] | Pivot: ${pivotValue} | Right: [${arr.slice(pivotFinalIdx + 1, high + 1).join(', ')}]`,
  })

  return pivotFinalIdx
}
