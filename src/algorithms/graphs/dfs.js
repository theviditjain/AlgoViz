// dfs.js
// Depth-First Search explores a graph by going AS DEEP AS POSSIBLE
// before backtracking. Uses a STACK (implicit via recursion, or explicit).
//
// Time:  O(V + E)
// Space: O(V) — recursion stack depth
//
// Real use cases: cycle detection, topological sort, maze solving,
// connected components, finding paths

export function dfsSteps(nodes, edges, startId) {
  const steps = []

  // Build adjacency list
  const adj = {}
  nodes.forEach(n => adj[n.id] = [])
  edges.forEach(e => {
    adj[e.from].push(e.to)
    adj[e.to].push(e.from)
  })

  const visited    = new Set()
  const stack      = []        // we track the explicit call stack for display
  const visitedArr = []

  steps.push({
    visited:    [],
    current:    -1,
    stack:      [startId],
    processing: -1,
    backtracking: false,
    finalOrder: [],
    explanation: `DFS starting from node ${startId}`,
    detail:      `Stack: [${startId}] — will go as deep as possible before backtracking`,
  })

  function dfs(node) {
    visited.add(node)
    visitedArr.push(node)
    stack.push(node)

    // SNAPSHOT: entering this node
    steps.push({
      visited:      [...visitedArr],
      current:      node,
      stack:        [...stack],
      processing:   node,
      backtracking: false,
      finalOrder:   [...visitedArr],
      explanation:  `Entering node ${node} — going deep`,
      detail:       `Stack (call depth): [${stack.join(' → ')}] | Visited: [${visitedArr.join(', ')}]`,
    })

    const neighbours = adj[node] || []

    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        // SNAPSHOT: about to recurse into neighbour
        steps.push({
          visited:      [...visitedArr],
          current:      node,
          stack:        [...stack],
          processing:   node,
          discovering:  neighbour,
          backtracking: false,
          finalOrder:   [...visitedArr],
          explanation:  `From node ${node} — exploring unvisited neighbour ${neighbour}`,
          detail:       `Going deeper: ${node} → ${neighbour}`,
        })
        dfs(neighbour)
      } else {
        // SNAPSHOT: neighbour already visited
        steps.push({
          visited:      [...visitedArr],
          current:      node,
          stack:        [...stack],
          processing:   node,
          backtracking: false,
          finalOrder:   [...visitedArr],
          explanation:  `Neighbour ${neighbour} already visited — skip`,
          detail:       `Stack: [${stack.join(' → ')}]`,
        })
      }
    }

    // Backtrack
    stack.pop()
    steps.push({
      visited:      [...visitedArr],
      current:      node,
      stack:        [...stack],
      processing:   node,
      backtracking: true,
      finalOrder:   [...visitedArr],
      explanation:  `Backtracking from node ${node} — all neighbours explored`,
      detail:       `Stack after backtrack: [${stack.length > 0 ? stack.join(' → ') : 'empty'}]`,
    })
  }

  dfs(startId)

  steps.push({
    visited:      [...visitedArr],
    current:      -1,
    stack:        [],
    processing:   -1,
    backtracking: false,
    finalOrder:   [...visitedArr],
    explanation:  `✓ DFS complete!`,
    detail:       `Visit order: ${visitedArr.join(' → ')}`,
  })

  return steps
}
