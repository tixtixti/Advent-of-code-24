const fs = require('node:fs').promises

async function main() {
    const map = (await fs.readFile('./input.txt', 'utf8')).split('\n')
    const graph = buildGraph(map)
    //const abba = findThreeNodeCycles(graph)
    console.log(findMaximumClique(graph).sort().join(','))
}
function buildGraph(connections) {
    const graph = {}

    connections.forEach((line) => {
        const [a, b] = line.split('-') // Split into two nodes
        if (!graph[a]) graph[a] = [] // Initialize adjacency list for `a` if not present
        if (!graph[b]) graph[b] = [] // Initialize adjacency list for `b` if not present
        graph[a].push(b) // Add `b` to `a`'s adjacency list
        graph[b].push(a) // Add `a` to `b`'s adjacency list
    })

    return graph
}

function findThreeNodeCycles(graph) {
    const cycles = new Set()

    for (const nodeA in graph) {
        // Check all neighbors of nodeA
        for (const nodeB of graph[nodeA]) {
            if (nodeB === nodeA) continue // Skip self-loops

            // Check all neighbors of nodeB
            for (const nodeC of graph[nodeB]) {
                if (nodeC === nodeA || nodeC === nodeB) continue // Skip invalid loops

                // Check if nodeC connects back to nodeA
                if (graph[nodeC].includes(nodeA)) {
                    if ([nodeA, nodeB, nodeC].some((cpu) => cpu[0] === 't')) {
                        const cycle = [nodeA, nodeB, nodeC].sort().join('-')
                        cycles.add(cycle) // Store unique cycles
                    }
                    // Create a sorted representation of the cycle to avoid duplicates
                }
            }
        }
    }

    // Convert the set of cycles back to an array of arrays
    return Array.from(cycles).map((cycle) => cycle.split('-'))
}

function findMaximumClique(graph) {
    const nodes = Object.keys(graph)
    let largestClique = []

    for (const startNode of nodes) {
        const clique = findMaximalCliqueFromNode(graph, startNode)
        if (clique.length > largestClique.length) {
            largestClique = clique
        }
    }

    return largestClique
}

function findMaximalCliqueFromNode(graph, startNode) {
    const clique = []
    clique.push(startNode)

    // Loop through all other nodes
    for (const node of Object.keys(graph)) {
        if (node === startNode) continue

        // Check if this node is connected to all nodes in the current clique
        const isConnectedToClique = clique.every((cliqueNode) =>
            graph[cliqueNode].includes(node)
        )

        // If it is, add it to the clique
        if (isConnectedToClique) {
            clique.push(node)
        }
    }

    return clique
}

main()
