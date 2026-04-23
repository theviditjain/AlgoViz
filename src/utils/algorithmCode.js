// algorithmCode.js
// Two things in this file:
//
// 1. PSEUDOCODE: Clean Java-style pseudocode for each algorithm
//    (shown in the code panel line by line)
//
// 2. getCodeLine(): Infers which line is "active" from the step's properties
//    WITHOUT needing to modify any existing algorithm files.
//    It reads the step snapshot and maps it to the right line index.

// ─────────────────────────────────────────────────────────────
// PSEUDOCODE STRINGS
// Each entry is an array of lines. Index = line number.
// ─────────────────────────────────────────────────────────────

export const ALGO_CODE = {
  bubble: [
    'void bubbleSort(int[] arr) {',
    '  for (int i = 0; i < n-1; i++) {',
    '    for (int j = 0; j < n-i-1; j++) {',
    '      if (arr[j] > arr[j+1]) {',
    '        swap(arr[j], arr[j+1]);',
    '      }',
    '    }',
    '  }',
    '}  // sorted!',
  ],

  selection: [
    'void selectionSort(int[] arr) {',
    '  for (int i = 0; i < n-1; i++) {',
    '    int minIdx = i;',
    '    for (int j = i+1; j < n; j++) {',
    '      if (arr[j] < arr[minIdx])',
    '        minIdx = j;  // new minimum found',
    '    }',
    '    swap(arr[i], arr[minIdx]);',
    '  }',
    '}  // sorted!',
  ],

  merge: [
    'void mergeSort(arr, left, right) {',
    '  if (left >= right) return;',
    '  int mid = (left + right) / 2;',
    '  mergeSort(arr, left, mid);',
    '  mergeSort(arr, mid+1, right);',
    '  merge(arr, left, mid, right);',
    '}',
    'void merge(arr, left, mid, right) {',
    '  copy left[left..mid], right[mid+1..right]',
    '  while (i < left.len && j < right.len) {',
    '    if (left[i] <= right[j])',
    '      arr[k++] = left[i++];',
    '    else',
    '      arr[k++] = right[j++];',
    '  }',
    '  copy remaining elements',
    '}  // subarray merged!',
  ],

  quick: [
    'void quickSort(arr, low, high) {',
    '  if (low >= high) return;',
    '  int pivot = arr[high];  // last element',
    '  int i = low - 1;',
    '  for (int j = low; j < high; j++) {',
    '    if (arr[j] <= pivot) {',
    '      i++;',
    '      swap(arr[i], arr[j]);',
    '    }',
    '  }',
    '  swap(arr[i+1], arr[high]);  // place pivot',
    '  int pi = i + 1;',
    '  quickSort(arr, low, pi - 1);',
    '  quickSort(arr, pi + 1, high);',
    '}  // sorted!',
  ],

  binary: [
    'int binarySearch(int[] arr, int target) {',
    '  int low = 0, high = arr.length - 1;',
    '  while (low <= high) {',
    '    int mid = (low + high) / 2;',
    '    if (arr[mid] == target)',
    '      return mid;  // found!',
    '    else if (arr[mid] < target)',
    '      low = mid + 1;  // go right',
    '    else',
    '      high = mid - 1;  // go left',
    '  }',
    '  return -1;  // not found',
    '}',
  ],

  bfs: [
    'void bfs(Graph g, int start) {',
    '  Queue<Integer> queue = new Queue();',
    '  Set<Integer> visited = new HashSet();',
    '  queue.add(start);',
    '  visited.add(start);',
    '  while (!queue.isEmpty()) {',
    '    int node = queue.poll();  // dequeue',
    '    process(node);',
    '    for (int neighbour : g.adj(node)) {',
    '      if (!visited.contains(neighbour)) {',
    '        visited.add(neighbour);',
    '        queue.add(neighbour);',
    '      }',
    '    }',
    '  }',
    '}  // all reachable nodes visited',
  ],

  dfs: [
    'void dfs(Graph g, int node, Set visited) {',
    '  visited.add(node);',
    '  process(node);  // entering',
    '  for (int neighbour : g.adj(node)) {',
    '    if (!visited.contains(neighbour))',
    '      dfs(g, neighbour, visited);  // recurse',
    '    // else: skip visited neighbour',
    '  }',
    '  // backtrack — all neighbours explored',
    '}',
  ],

  dijkstra: [
    'void dijkstra(Graph g, int start) {',
    '  int[] dist = new int[V];',
    '  Arrays.fill(dist, Integer.MAX_VALUE);',
    '  dist[start] = 0;',
    '  PriorityQueue<int[]> pq = new PriorityQueue();',
    '  pq.add({start, 0});',
    '  while (!pq.isEmpty()) {',
    '    int node = pq.poll()[0];  // min dist node',
    '    for (int[] edge : g.adj(node)) {',
    '      int newDist = dist[node] + edge.weight;',
    '      if (newDist < dist[edge.to]) {',
    '        dist[edge.to] = newDist;  // relax!',
    '        pq.add({edge.to, newDist});',
    '      }',
    '    }',
    '  }',
    '}  // all shortest distances found',
  ],
}

// ─────────────────────────────────────────────────────────────
// getCodeLine()
// Infers the active line index from step properties.
// No changes needed to any algorithm file — purely derived.
// ─────────────────────────────────────────────────────────────

export function getCodeLine(algoKey, step) {
  if (!step) return -1
  const exp = step.explanation || ''

  switch (algoKey) {

    case 'bubble': {
      if (exp.includes('fully sorted'))          return 8  // done
      if (step.swapped?.length > 0)              return 4  // swap line
      if (exp.includes('Comparing'))             return 3  // if arr[j] > arr[j+1]
      return 2                                             // inner for loop
    }

    case 'selection': {
      if (exp.includes('fully sorted'))          return 9  // done
      if (exp.includes('placed') || exp.includes('already in the right')) return 7  // swap
      if (exp.includes('new minimum') || exp.includes('New minimum')) return 5  // minIdx = j
      if (exp.includes('current min'))           return 4  // if arr[j] < arr[minIdx]
      if (exp.includes('minimum'))               return 2  // minIdx = i
      return 1                                             // outer for loop
    }

    case 'merge': {
      if (exp.includes('fully sorted'))          return 16 // done
      if (exp.includes('merged and sorted'))     return 16 // subarray done
      if (exp.includes('remaining right'))       return 15 // copy remaining
      if (exp.includes('remaining left'))        return 15 // copy remaining
      if (exp.includes('Placed'))                return 11 // arr[k++] = left/right
      if (exp.includes('≤'))                     return 10 // if left <= right
      if (exp.includes('Merging'))               return 9  // while loop
      if (exp.includes('Dividing'))              return 2  // mid = ...
      return 0                                             // function entry
    }

    case 'quick': {
      if (exp.includes('fully sorted'))          return 14 // done
      if (exp.includes('Pivot selected'))        return 2  // pivot = arr[high]
      if (exp.includes('≤ pivot') && exp.includes('Yes')) return 7  // swap line
      if (exp.includes('≤ pivot'))               return 5  // if arr[j] <= pivot
      if (exp.includes('final position'))        return 10 // place pivot
      return 4                                             // for loop
    }

    case 'binary': {
      if (exp.includes('not found'))             return 11 // return -1
      if (exp.includes('Found'))                 return 5  // return mid
      if (exp.includes('eliminate left'))        return 7  // low = mid + 1
      if (exp.includes('eliminate right'))       return 9  // high = mid - 1
      if (exp.includes('Checking middle'))       return 4  // if arr[mid] == target
      return 2                                             // while loop
    }

    case 'bfs': {
      if (exp.includes('complete'))              return 15 // done
      if (exp.includes('already visited'))       return 9  // if !visited
      if (exp.includes('Discovered'))            return 11 // queue.add
      if (exp.includes('Processing') || exp.includes('dequeued')) return 6  // poll
      if (exp.includes('starting'))              return 3  // queue.add(start)
      return 5                                             // while loop
    }

    case 'dfs': {
      if (exp.includes('complete'))              return 9  // done
      if (exp.includes('Backtracking'))          return 8  // backtrack comment
      if (exp.includes('already visited') || exp.includes('skip')) return 6  // else skip
      if (exp.includes('exploring unvisited'))   return 5  // dfs recurse
      if (exp.includes('Entering'))              return 2  // process(node)
      return 0                                             // function entry
    }

    case 'dijkstra': {
      if (exp.includes('complete'))              return 16 // done
      if (exp.includes('Relaxed'))               return 11 // dist[to] = newDist
      if (exp.includes('newDist') || exp.includes('improve') || exp.includes('Checking edge')) return 10 // if newDist < dist
      if (exp.includes('Processing node'))       return 7  // poll
      if (exp.includes('initialized'))           return 3  // dist[start] = 0
      return 6                                             // while loop
    }

    default:
      return -1
  }
}
