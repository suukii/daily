export class TrieNode {
    value: string
    children: Array<TrieNode>

    constructor(value) {
        this.value = value
        this.children = Array(26)
    }
}

export class Trie {
    private root: TrieNode

    constructor() {
        this.root = this._getTrieNode('')
    }

    private _getTrieNode(value: string): TrieNode {
        return new TrieNode(value)
    }

    private _char2Index(char: string): number {
        return char.toLowerCase().charCodeAt(0) - 97
    }

    insert(word: string): void {
        let crawl: TrieNode = this.root
        for (let char of word) {
            const index: number = this._char2Index(char)
            if (!crawl.children[index]) {
                crawl.children[index] = this._getTrieNode('')
            }
            crawl = crawl.children[index]
        }
        crawl.value = word
    }

    search(word: string): boolean {
        let crawl: TrieNode = this.root
        for (let char of word) {
            const index: number = this._char2Index(char)
            if (!crawl.children[index]) return false
            crawl = crawl.children[index]
        }
        return crawl.value === word
    }

    startsWith(prefix: string): boolean {
        let crawl: TrieNode = this.root
        for (let char of prefix) {
            const index: number = this._char2Index(char)
            if (!crawl.children[index]) return false
            crawl = crawl.children[index]
        }
        return true
    }
}
