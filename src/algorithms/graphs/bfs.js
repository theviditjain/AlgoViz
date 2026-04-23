// bfs.js
// Breadth-First Search explores a graph LEVEL BY LEVEL.
// It uses a QUEUE (FIFO) — process all neighbours of current node
// before going deeper. Guarantees shortest path in unweighted graphs.
//
// Time:  O(V + E) — visits every vertex and edge once
// Space: O(V)     — queue can hold at most all vertices
//
// Real use cases: shortest path, social network degrees of separation,
// level-order tree traversal, web crawlers

export function bfsSteps(nodes, edges, startId) {
  const steps = []

  // Build adjacency list from edges
  // { nodeId: [neighbour1, neighbour2, ...] }
  const adj = {}
  nodes.forEach(n => adj[n.id] = [])
  edges.forEach(e => {
    adj[e.from].push(e.to)
    adj[e.to].push(e.from)   // undirected graph
  })

  const visited   = new Set()
  const queue     = [startId]
  const visitedArr = []       // ordered list of visit sequence
  visited.add(startId)

  // SNAPSHOT: initial state
  steps.push({
    visited:   [],
    current:   -1,
    queue:     [startId],
    processing: -1,
    finalOrder: [],
    explanation: `BFS starting from node ${startId}`,
    detail:      `Queue initialized with start node. Queue: [${startId}]`,
  })

  while (queue.length > 0) {
    const curr = queue.shift()   // dequeue from FRONT (FIFO)
    visitedArr.push(curr)

    // SNAPSHOT: processing this node
    steps.push({
      visited:    [...visitedArr],
      current:    curr,
      queue:      [...queue],
      processing: curr,
      finalOrder: [...visitedArr],
      explanation: `Processing node ${curr} — dequeued from front`,
      detail:      `Visited order so far: [${visitedArr.join(' → ')}] | Queue: [${queue.join(', ')}]`,
    })

    // Explore all unvisited neighbours
    const neighbours = adj[curr] || []
    const newlyQueued = []

    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour)
        queue.push(neighbour)
        newlyQueued.push(neighbour)

        // SNAPSHOT: discovered a new neighbour
        steps.push({
          visited:    [...visitedArr],
          current:    curr,
          queue:      [...queue],
          processing: curr,
          discovering: neighbour,    // edge being explored
          finalOrder:  [...visitedArr],
          explanation: `Discovered neighbour ${neighbour} from node ${curr} — added to queue`,
          detail:      `Queue: [${queue.join(', ')}]`,
        })
      }
    }

    if (newlyQueued.length === 0) {
      steps.push({
        visited:    [...visitedArr],
        current:    curr,
        queue:      [...queue],
        processing: curr,
        finalOrder: [...visitedArr],
        explanation: `Node ${curr} — all neighbours already visited`,
        detail:      `Queue: [${queue.length > 0 ? queue.join(', ') : 'empty'}]`,
      })
    }
  }

  // Final snapshot
  steps.push({
    visited:    [...visitedArr],
    current:    -1,
    queue:      [],
    processing: -1,
    finalOrder: [...visitedArr],
    explanation: `✓ BFS complete!`,
    detail:      `Visit order: ${visitedArr.join(' → ')}`,
  })

  return steps
}
