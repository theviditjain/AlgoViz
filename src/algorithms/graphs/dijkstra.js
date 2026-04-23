// dijkstra.js
// Dijkstra's Algorithm finds the SHORTEST PATH from a source node
// to all other nodes in a weighted graph (no negative weights).
//
// Uses a MIN-HEAP (priority queue) — always process the unvisited
// node with the smallest known distance first.
//
// Time:  O((V + E) log V) with a priority queue
// Space: O(V) — distance table + visited set
//
// Real use cases: GPS navigation, network routing (OSPF protocol),
// game pathfinding (A* is based on Dijkstra's)

export function dijkstraSteps(nodes, edges, startId) {
  const steps = []

  // Build weighted adjacency list
  // { nodeId: [{ to, weight }, ...] }
  const adj = {}
  nodes.forEach(n => adj[n.id] = [])
  edges.forEach(e => {
    adj[e.from].push({ to: e.to,   weight: e.weight })
    adj[e.to].push(  { to: e.from, weight: e.weight })
  })

  // Distance table: all infinity except start = 0
  const dist    = {}
  const prev    = {}   // to reconstruct shortest path
  const visited = new Set()

  nodes.forEach(n => {
    dist[n.id] = Infinity
    prev[n.id] = null
  })
  dist[startId] = 0

  // Simple min-priority queue (array-based, fine for small graphs)
  // In a real interview you'd mention: "I'd use a binary min-heap here"
  const pq = [{ id: startId, dist: 0 }]

  const distSnapshot = () => {
    const d = {}
    nodes.forEach(n => { d[n.id] = dist[n.id] === Infinity ? '∞' : dist[n.id] })
    return d
  }

  steps.push({
    visited:   [],
    current:   -1,
    distances: distSnapshot(),
    relaxing:  null,
    finalPath: [],
    explanation: `Dijkstra's from node ${startId} — all distances initialized to ∞ except start`,
    detail: `Processing node by node — watch the distance table on the right update.`,
  })

  while (pq.length > 0) {
    // Extract min (sort to simulate priority queue)
    pq.sort((a, b) => a.dist - b.dist)
    const { id: curr } = pq.shift()

    if (visited.has(curr)) continue
    visited.add(curr)

    // SNAPSHOT: processing this node
    steps.push({
      visited:   [...visited],
      current:   curr,
      distances: distSnapshot(),
      relaxing:  null,
      finalPath: [],
      explanation: `Processing node ${curr} — shortest known distance: ${dist[curr]}`,
      detail:      `This node has the smallest unvisited distance. Exploring its neighbours.`,
    })

    // Relax all edges from curr
    for (const { to, weight } of (adj[curr] || [])) {
      if (visited.has(to)) continue

      const newDist = dist[curr] + weight

      // SNAPSHOT: checking this edge
      steps.push({
        visited:    [...visited],
        current:    curr,
        distances:  distSnapshot(),
        relaxing:   { from: curr, to, weight },
        finalPath:  [],
        explanation: `Checking edge ${curr} → ${to} (weight ${weight})`,
        detail:      `Can we improve distance to ${to}? Current: ${dist[to] === Infinity ? '∞' : dist[to]}, Via ${curr}: ${dist[curr]} + ${weight} = ${newDist}`,
      })

      if (newDist < dist[to]) {
        dist[to] = newDist
        prev[to] = curr
        pq.push({ id: to, dist: newDist })

        // SNAPSHOT: relaxed! updated distance
        steps.push({
          visited:    [...visited],
          current:    curr,
          distances:  distSnapshot(),
          relaxing:   { from: curr, to, weight, improved: true },
          finalPath:  [],
          explanation: `✓ Relaxed! Distance to ${to} updated: ${newDist} (was ${dist[to] === newDist ? '∞ or more' : 'more'})`,
          detail:      `Path to ${to}: ${getPath(prev, to, startId).join(' → ')}`,
        })
      }
    }
  }

  // Build final shortest paths
  const allPaths = {}
  nodes.forEach(n => {
    allPaths[n.id] = getPath(prev, n.id, startId)
  })

  steps.push({
    visited:    [...visited],
    current:    -1,
    distances:  distSnapshot(),
    relaxing:   null,
    finalPath:  allPaths,
    explanation: `✓ Dijkstra's complete! All shortest distances from node ${startId} found.`,
    detail: `All shortest distances from node ${startId} have been finalized.`,
  })

  return steps
}

// Helper: reconstruct path from prev[] table
function getPath(prev, target, start) {
  const path = []
  let curr = target
  while (curr !== null) {
    path.unshift(curr)
    curr = prev[curr]
  }
  if (path[0] !== start) return ['unreachable']
  return path
}
