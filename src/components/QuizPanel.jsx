// QuizMe.jsx
// Hardcoded questions per algorithm — free forever, no API key needed.
// 5 questions per algo, picks 3 randomly each time.

import { useState } from 'react'

const QUESTION_BANK = {
  bubble: [
    { q: "What is the time complexity of Bubble Sort in the worst case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 2, explanation: "Bubble Sort has two nested loops — outer runs n times, inner runs up to n times, giving O(n²) comparisons." },
    { q: "What is the space complexity of Bubble Sort?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 3, explanation: "Bubble Sort sorts in-place using only a temp variable for swaps, so space complexity is O(1)." },
    { q: "How many passes does Bubble Sort need to guarantee one element is in its final position?", options: ["After every swap", "After each full pass", "After n/2 passes", "Only at the end"], answer: 1, explanation: "After each full pass, the largest unsorted element bubbles to its correct position at the end." },
    { q: "When is Bubble Sort at its best-case time complexity of O(n)?", options: ["When the array is reverse sorted", "When the array is already sorted", "When all elements are equal", "When n is very small"], answer: 1, explanation: "With an optimized version (early exit on no swaps), a sorted array completes in one pass — O(n) comparisons." },
    { q: "Which of these is TRUE about Bubble Sort?", options: ["It is not a stable sort", "It always takes O(n²) time", "Equal elements maintain their relative order", "It uses O(n) extra space"], answer: 2, explanation: "Bubble Sort is stable — it only swaps adjacent elements when strictly out of order, so equal elements never cross each other." },
  ],
  selection: [
    { q: "What does Selection Sort do in each pass?", options: ["Swaps adjacent elements", "Finds minimum and places it correctly", "Splits array in half", "Inserts element into sorted position"], answer: 1, explanation: "Each pass scans the unsorted portion to find the minimum element and swaps it to the front of the unsorted section." },
    { q: "What is the time complexity of Selection Sort in ALL cases?", options: ["O(n) best, O(n²) worst", "O(n log n)", "Always O(n²)", "O(n²) average only"], answer: 2, explanation: "Selection Sort always scans all remaining elements to find the minimum — it's O(n²) in best, average, and worst case." },
    { q: "Is Selection Sort stable?", options: ["Yes, always", "No, it can disturb equal elements", "Yes, if implemented carefully", "Depends on input"], answer: 1, explanation: "Standard Selection Sort is NOT stable — swapping the minimum to the front can jump over equal elements and change their order." },
    { q: "How many swaps does Selection Sort make at most?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], answer: 2, explanation: "Selection Sort makes exactly one swap per pass (putting the minimum in place), so at most O(n) swaps total — much fewer than Bubble Sort." },
    { q: "Compared to Bubble Sort on a sorted array, Selection Sort is:", options: ["Faster — O(n)", "The same — O(n²)", "Slower — O(n³)", "Unpredictable"], answer: 1, explanation: "Unlike Bubble Sort, Selection Sort has no early-exit optimization, so it always runs O(n²) regardless of input order." },
  ],
  merge: [
    { q: "What is the core idea behind Merge Sort?", options: ["Find pivot and partition", "Swap adjacent elements repeatedly", "Divide array in half recursively, then merge", "Insert each element into sorted position"], answer: 2, explanation: "Merge Sort is divide-and-conquer — split into halves until single elements, then merge sorted halves back together." },
    { q: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2, explanation: "Merge Sort needs O(n) auxiliary space to hold the merged result at each level of recursion." },
    { q: "Why is Merge Sort preferred over Quick Sort for linked lists?", options: ["It's faster", "It doesn't need random access", "It uses less memory", "It has fewer comparisons"], answer: 1, explanation: "Merge Sort accesses elements sequentially, which is natural for linked lists. Quick Sort needs random index access which is O(n) on linked lists." },
    { q: "What is the recurrence relation for Merge Sort?", options: ["T(n) = T(n-1) + O(n)", "T(n) = 2T(n/2) + O(n)", "T(n) = T(n/2) + O(1)", "T(n) = 2T(n-1) + O(1)"], answer: 1, explanation: "It makes 2 recursive calls on n/2 sized arrays, then merges in O(n) — giving T(n) = 2T(n/2) + O(n), which solves to O(n log n)." },
    { q: "Is Merge Sort a stable sorting algorithm?", options: ["No", "Yes", "Depends on implementation", "Only for integers"], answer: 1, explanation: "Merge Sort is stable — during the merge step, when elements are equal, we take from the left array first, preserving original order." },
  ],
  quick: [
    { q: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], answer: 1, explanation: "Worst case is O(n²) — happens when pivot is always the smallest or largest element (e.g. sorted array with first-element pivot)." },
    { q: "What makes Quick Sort fast in practice despite O(n²) worst case?", options: ["It uses less memory", "Average case is O(n log n) with good cache performance", "It's always faster than Merge Sort", "It makes fewer comparisons in all cases"], answer: 1, explanation: "Quick Sort has excellent cache locality (in-place), and with good pivot choice the average case is O(n log n) — making it fast in practice." },
    { q: "What is the purpose of the pivot in Quick Sort?", options: ["Mark the sorted boundary", "Partition elements into smaller and larger halves", "Find the median element", "Merge two subarrays"], answer: 1, explanation: "The pivot partitions the array so all elements less than pivot go left, all greater go right — then each half is recursively sorted." },
    { q: "Which pivot strategy best avoids the O(n²) worst case?", options: ["Always pick first element", "Always pick last element", "Random pivot or median-of-three", "Always pick middle index"], answer: 2, explanation: "Random pivot or median-of-three makes it statistically unlikely to hit the worst case, keeping expected time O(n log n)." },
    { q: "Is Quick Sort a stable sorting algorithm?", options: ["Yes", "No", "Depends on pivot choice", "Yes if array has no duplicates"], answer: 1, explanation: "Quick Sort is NOT stable — the partitioning step can change the relative order of equal elements." },
  ],
  binary: [
    { q: "What is the key precondition for Binary Search to work?", options: ["Array must be unsorted", "Array must be sorted", "Array must have unique elements", "Array must have even length"], answer: 1, explanation: "Binary Search eliminates half the search space each step by comparing with the middle element — this only works if the array is sorted." },
    { q: "What is the time complexity of Binary Search?", options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], answer: 2, explanation: "Each comparison halves the remaining elements. Starting from n, it takes log₂(n) steps to reach 1 — giving O(log n)." },
    { q: "How many comparisons does Binary Search need for an array of 1024 elements (worst case)?", options: ["1024", "512", "10", "32"], answer: 2, explanation: "log₂(1024) = 10. Binary Search halves the space each step, so 1024 → 512 → 256 → ... → 1 takes exactly 10 steps." },
    { q: "What happens when Binary Search doesn't find the target?", options: ["It returns -1 or signals not found", "It crashes", "It returns 0", "It sorts the array first"], answer: 0, explanation: "When low > high, the search space is exhausted and the element doesn't exist — conventionally return -1 or throw not-found." },
    { q: "Which data structure is Binary Search most naturally applied to?", options: ["Linked List", "Hash Map", "Sorted Array or BST", "Stack"], answer: 2, explanation: "Sorted arrays support O(1) random access needed by Binary Search. BSTs encode the same logic structurally in their left/right child pointers." },
  ],
  bfs: [
    { q: "What data structure does BFS use internally?", options: ["Stack", "Queue", "Heap", "Linked List"], answer: 1, explanation: "BFS uses a Queue (FIFO) — nodes are added to the back and processed from the front, ensuring level-by-level traversal." },
    { q: "What is the time complexity of BFS on a graph with V vertices and E edges?", options: ["O(V²)", "O(V × E)", "O(V + E)", "O(log V)"], answer: 2, explanation: "BFS visits every vertex once (O(V)) and traverses every edge once (O(E)), giving O(V + E) total." },
    { q: "BFS finds the shortest path in which type of graph?", options: ["Weighted graphs", "Unweighted graphs", "Directed graphs only", "Cyclic graphs only"], answer: 1, explanation: "BFS finds shortest path (fewest edges) in unweighted graphs. For weighted graphs you need Dijkstra's or Bellman-Ford instead." },
    { q: "Which traversal explores nodes level by level?", options: ["DFS", "BFS", "Dijkstra's", "Topological Sort"], answer: 1, explanation: "BFS processes all nodes at distance 1 first, then distance 2, etc — this natural level-by-level order is why BFS finds shortest paths." },
    { q: "What is the space complexity of BFS in the worst case?", options: ["O(1)", "O(log V)", "O(V)", "O(V + E)"], answer: 2, explanation: "In the worst case (e.g. a star graph), all neighbors of the start node are in the queue simultaneously — requiring O(V) space." },
  ],
  dfs: [
    { q: "What data structure does DFS use (recursively)?", options: ["Queue", "Heap", "Call Stack", "Linked List"], answer: 2, explanation: "Recursive DFS uses the call stack implicitly. Each recursive call pushes a frame; backtracking pops it — it's a LIFO structure." },
    { q: "What is the time complexity of DFS?", options: ["O(V²)", "O(V + E)", "O(E log V)", "O(V × E)"], answer: 1, explanation: "DFS visits every vertex once and processes every edge once — O(V + E) just like BFS." },
    { q: "Which algorithm is better for detecting cycles in a graph?", options: ["BFS", "DFS", "Both are equal", "Neither can detect cycles"], answer: 1, explanation: "DFS naturally detects back edges (edges pointing to an ancestor in the DFS tree), which indicate cycles. It's the standard approach." },
    { q: "DFS on a tree performs which classic traversal?", options: ["Level-order", "Pre/In/Post-order", "Reverse-order", "Breadth-first"], answer: 1, explanation: "Pre-order, in-order, and post-order tree traversals are all specific forms of DFS, differing only in when the node is processed." },
    { q: "What is the space complexity of DFS in the worst case (on a path graph)?", options: ["O(1)", "O(log V)", "O(V)", "O(E)"], answer: 2, explanation: "On a linear path (1→2→3→...→n), DFS recurses n levels deep, using O(V) stack space." },
  ],
  dijkstra: [
    { q: "What data structure makes Dijkstra's algorithm efficient?", options: ["Queue (FIFO)", "Stack (LIFO)", "Min-Heap / Priority Queue", "Hash Map"], answer: 2, explanation: "A Min-Heap lets Dijkstra's always pick the unvisited node with the smallest tentative distance in O(log V) time." },
    { q: "What is the time complexity of Dijkstra's with a binary heap?", options: ["O(V²)", "O(V + E)", "O((V + E) log V)", "O(E log E)"], answer: 2, explanation: "Each vertex is extracted from the heap once (O(V log V)) and each edge may trigger a decrease-key (O(E log V)), giving O((V+E) log V)." },
    { q: "Why does Dijkstra's algorithm fail on negative edge weights?", options: ["It crashes", "It runs forever", "It may finalize a node with non-optimal distance", "It can't represent negative weights"], answer: 2, explanation: "Dijkstra's assumes once a node is finalized its distance is optimal. Negative edges can create shorter paths discovered later, violating this assumption." },
    { q: "Dijkstra's algorithm is a greedy algorithm. What does it greedily do?", options: ["Always pick the edge with min weight", "Always pick the unvisited node with smallest tentative distance", "Always expand all neighbors first", "Always process the most connected node"], answer: 1, explanation: "The greedy choice is: always process the unvisited node with the smallest current known distance — this locally optimal choice leads to globally optimal shortest paths." },
    { q: "Which algorithm should you use instead of Dijkstra's for graphs with negative edge weights?", options: ["BFS", "DFS", "Bellman-Ford", "Floyd-Warshall (for single source)"], answer: 2, explanation: "Bellman-Ford handles negative edge weights by relaxing all edges V-1 times, and can also detect negative cycles." },
  ],
}

function getRandomQuestions(algoKey, count = 3) {
  const bank = QUESTION_BANK[algoKey] || QUESTION_BANK.bubble
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function QuizMe({ algoName, algoKey }) {
  const [phase,     setPhase]     = useState('idle')
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [revealed,  setRevealed]  = useState(false)
  const [score,     setScore]     = useState(0)

  const startQuiz = () => {
    const qs = getRandomQuestions(algoKey)
    setQuestions(qs)
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setPhase('active')
  }

  const handleSelect = (idx) => {
    if (revealed) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setRevealed(true)
    if (selected === questions[current].answer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setPhase('done')
    }
  }

  const handleReset = () => {
    setPhase('idle')
    setQuestions([])
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
  }

  const q = questions[current]

  // ── IDLE ──
  if (phase === 'idle') return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <span className="ai-label">QUIZ ME</span>
        <span className="quiz-badge">3 questions</span>
      </div>
      <p className="quiz-description">
        Test your understanding of <span style={{ color: 'var(--cyan)' }}>{algoName}</span> — complexity, behaviour, and edge cases.
      </p>
      <button className="btn-quiz-start" onClick={startQuiz}>▶ Start Quiz</button>
    </div>
  )

  // ── DONE ──
  if (phase === 'done') return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <span className="ai-label">QUIZ ME</span>
        <span className="quiz-badge">Complete</span>
      </div>
      <div className="quiz-result">
        <div className="quiz-score-big">{score} / {questions.length}</div>
        <div className="quiz-result-label">
          {score === questions.length
            ? '🔥 Perfect — you know this cold.'
            : score >= 2
            ? '✅ Solid. Review the ones you missed.'
            : '📖 Go back through the visualizer and try again.'}
        </div>
      </div>
      <button className="btn-quiz-start" onClick={startQuiz} style={{ marginTop: '4px' }}>↺ New Questions</button>
    </div>
  )

  // ── ACTIVE ──
  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <span className="ai-label">QUIZ ME</span>
        <span className="quiz-progress">
          {current + 1} / {questions.length}
          &nbsp;·&nbsp;
          <span style={{ color: 'var(--green)' }}>{score} correct</span>
        </span>
      </div>

      <div className="quiz-dots">
        {questions.map((_, i) => (
          <div key={i} className={`quiz-dot ${i < current ? 'quiz-dot-done' : i === current ? 'quiz-dot-active' : ''}`} />
        ))}
      </div>

      <div className="quiz-question">{q.q}</div>

      <div className="quiz-options">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect  = revealed && i === q.answer
          const isWrong    = revealed && isSelected && i !== q.answer
          return (
            <button
              key={i}
              className={`quiz-option ${isSelected && !revealed ? 'quiz-option-selected' : ''} ${isCorrect ? 'quiz-option-correct' : ''} ${isWrong ? 'quiz-option-wrong' : ''}`}
              onClick={() => handleSelect(i)}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz-option-text">{opt}</span>
              {isCorrect && <span className="quiz-option-icon">✓</span>}
              {isWrong   && <span className="quiz-option-icon">✗</span>}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="quiz-explanation">
          <span style={{ color: 'var(--cyan)' }}>Why: </span>{q.explanation}
        </div>
      )}

      <div className="quiz-actions">
        {!revealed ? (
          <button className="btn-quiz-confirm" onClick={handleConfirm} disabled={selected === null}>
            Confirm Answer
          </button>
        ) : (
          <button className="btn-quiz-start" onClick={handleNext}>
            {current < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
        <button className="btn-quiz-skip" onClick={handleReset}>✕ Quit</button>
      </div>
    </div>
  )
}
