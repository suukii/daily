export class UnionFind {
    private parents: Array<number>
    private rank: Array<number>
    private numOfSets: number

    constructor(size: number) {
        this.parents = Array(size)
            .fill(0)
            .map((_, i) => i)
        this.rank = Array(size).fill(0)
        this.numOfSets = size
    }

    size(): number {
        return this.numOfSets
    }

    findSet(x: number): number {
        if (x !== this.parents[x]) {
            this.parents[x] = this.findSet(this.parents[x])
        }
        return this.parents[x]
    }

    unionSet(x: number, y: number): void {
        const px: number = this.findSet(x)
        const py: number = this.findSet(y)
        if (px === py) return
        if (this.rank[px] > this.rank[py]) {
            this.parents[py] = px
        } else {
            this.parents[px] = py
            this.rank[px] === this.rank[py] && ++this.rank[py]
        }
        this.numOfSets--
    }
}
