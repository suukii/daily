export class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices // 顶点数量
        this.adjList = new Map() // 邻接表
    }

    // 增加顶点
    addVertex(v) {
        // 在邻接表中增加一个列表来记录该顶点的邻接点
        this.adjList.set(v, [])
    }

    // 增加边
    addEdge(v, w) {
        // 分别把顶点 v, w 加到对方的邻接点列表中
        this.adjList.get(v).push(w)
        this.adjList.get(w).push(v)
    }

    bfs(v) {
        const visited = Array(this.noOfVertices).fill(false)
        const queue = []
        queue.push(v)
        visited[v] = true
        while (queue.length > 0) {
            const node = queue.shift()
            console.log(node)
            const neighs = this.adjList.get(node)
            neighs.forEach(neigh => {
                if (!visited[neigh]) {
                    visited[neigh] = true
                    queue.push(neigh)
                }
            })
        }
    }

    dfs() {
        const visited = Array(this.noOfVertices).fill(false)
        const vertices = this.adjList.keys()
        for (let vertex of vertices) {
            if (!visited[vertex]) {
                this.dfsUntil(vertex, visited)
            }
        }
    }
    dfsUntil(v, visited) {
        if (!visited[v]) {
            visited[v] = true
            console.log(v)
        }
        const neighs = this.adjList.get(v)
        neighs.forEach(neigh => {
            if (!visited[neigh]) {
                this.dfsUntil(neigh, visited)
            }
        })
    }
}

var g = new Graph(6)
var vertices = ['A', 'B', 'C', 'D', 'E', 'F']
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i])
}
g.addEdge('A', 'B')
g.addEdge('A', 'D')
g.addEdge('A', 'E')
g.addEdge('B', 'C')
g.addEdge('D', 'E')
g.addEdge('E', 'F')
g.addEdge('E', 'C')
g.addEdge('C', 'F')
g.dfs('A')
g.bfs('A')
