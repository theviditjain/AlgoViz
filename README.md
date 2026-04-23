# AlgoViz
# [AlgoViz] — Interactive DSA Visualizer + AI Explainer

> **8 algorithms. Step-by-step. AI-powered explanations. Built from scratch.**

![AlgoViz Demo](./demo.gif)

---

## ✨ Features

### 🧩 Algorithm Visualizer
Step through algorithms one move at a time — forward, backward, or on auto-play.

| Category | Algorithms |
|---|---|
| Sorting | Bubble Sort, Selection Sort, Merge Sort, Quick Sort |
| Searching | Binary Search |
| Graphs | BFS, DFS, Dijkstra's Shortest Path |

### ⚡ Race Mode
Run two sorting algorithms **side by side on the same array** and watch complexity differences play out in real time. Watch Bubble Sort's O(n²) lose to Merge Sort's O(n log n) — visually.

### 💻 Code Panel
Live pseudocode panel that **highlights the exact line currently executing** as you step through — like a debugger for algorithms.

### 🤖 AI Explainer
Click **"Why this step?"** at any point and get a plain-English explanation of what the algorithm is doing and why — powered by Groq (Llama 3.1).

### 🎯 Quiz Me
After watching an algorithm, test your understanding with 3 algorithm-specific MCQs covering time/space complexity, behaviour, and edge cases.

### 🕸️ Interactive Graph Builder
For BFS, DFS, and Dijkstra's — **draw your own graph**:
- Click canvas to add nodes
- Click two nodes to connect them with an edge
- Click edge weights to edit them
- Drag nodes to reposition
- Right-click to delete

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Animations | CSS transitions |
| AI | Groq API (Llama 3.1 8B Instant) |
| Deploy | Vercel |

> **Zero backend. Zero database.** All algorithm logic runs client-side in pure JavaScript.

---

## 🧠 DSA Under the Hood

Every algorithm is implemented from scratch in JavaScript — not imported from a library.

The core idea is a **Step Engine**: instead of running the algorithm and showing the result, each algorithm generates an array of **state snapshots** before executing. The UI simply plays through these snapshots.

```js
// Example — Bubble Sort step generation
steps.push({
  array: [...arr],
  comparing: [j, j + 1],
  swapped: false,
  explanation: `Comparing ${arr[j]} and ${arr[j+1]}`
})
```

This pattern works for every algorithm — sorting, searching, and graphs — with a consistent `useStepEngine` hook driving all controls.

---

## 🚀 Running Locally

```bash
git clone https://github.com/theviditjain/algoviz.git
cd algoviz
npm install
```

Create a `.env` file:
```
VITE_GROQ_API_KEY=your_groq_key_here
```
Get a free Groq key at [console.groq.com](https://console.groq.com) — no credit card needed.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> The app works fully without the API key — only the AI Explainer button requires it.

---

## 📁 Project Structure

```
algoviz/
├── src/
│   ├── algorithms/
│   │   ├── sorting/         ← bubbleSort, mergeSort, quickSort, selectionSort
│   │   ├── searching/       ← binarySearch
│   │   └── graphs/          ← bfs, dfs, dijkstra
│   │
│   ├── components/
│   │   ├── ArrayVisualizer.jsx      ← bar chart for sorting
│   │   ├── BinarySearchVisualizer.jsx
│   │   ├── GraphVisualizer.jsx      ← interactive SVG graph
│   │   ├── CodePanel.jsx            ← live pseudocode highlight
│   │   ├── RaceMode.jsx             ← side-by-side race
│   │   ├── QuizMe.jsx               ← MCQ quiz per algorithm
│   │   ├── AIExplainer.jsx          ← Groq AI integration
│   │   ├── StepControls.jsx
│   │   ├── InputPanel.jsx
│   │   └── AlgoSelector.jsx
│   │
│   ├── hooks/
│   │   └── useStepEngine.js         ← core step playback engine
│   │
│   └── utils/
│       └── algorithmCode.js         ← pseudocode strings + active line mapping
```

---

## 🎨 Design System

Dark terminal aesthetic — JetBrains Mono + Syne fonts.

| Color | Usage |
|---|---|
| `#00d4ff` Cyan | Comparing, active, selected |
| `#ff6b35` Orange | Swapping, wrong answer, pivot |
| `#00ff88` Green | Sorted, correct answer, winner |
| `#080810` Near-black | Background |

---



## 🔗 Live Demo

**[algoviz.vercel.app](https://algo-viz-one.vercel.app/)

---

## 👤 Author

**Vidit Jain** — B.Tech CSE  
[GitHub](https://github.com/theviditjain) · [LinkedIn](www.linkedin.com/in/vidit-jain-3322b1299)
