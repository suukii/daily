export class TrieNode {
    constructor(val) {
        this.value = val
        this.pointers = Array(26)
    }
}

export class Trie {
    constructor() {
        this.root = this._getTrieNode('')
    }

    /**
     * @param {string} val
     */
    _getTrieNode(val) {
        return new TrieNode(val)
    }

    /**
     * @param {string} char
     * @returns {number}
     */
    _char2Index(char) {
        return char.toLowerCase().charCodeAt(0) - 97
    }

    /**
     * Inserts a word into the trie.
     * @param {string} word
     * @return {void}
     */
    insert(word) {
        let crawl = this.root
        for (let char of word) {
            const index = this._char2Index(char)
            if (!crawl.pointers[index]) {
                crawl.pointers[index] = this._getTrieNode('')
            }
            crawl = crawl.pointers[index]
        }
        // Store the word in the last TrieNode as an end mark.
        crawl.value = word
    }

    /**
     * Returns if the word is in the trie.
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        let crawl = this.root
        for (let char of word) {
            const index = this._char2Index(char)
            if (!crawl.pointers[index]) return false

            crawl = crawl.pointers[index]
        }
        // If it has a stored value, it is the last TrieNode, i.e., the desired word is found.
        // Otherwise, the word doesn't exist in Trie.
        return !!crawl.value
    }

    /**
     * Returns if there is any word in the trie that starts with the given prefix.
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {
        let crawl = this.root
        for (let char of prefix) {
            const index = this._char2Index(char)
            if (!crawl.pointers[index]) return false

            crawl = crawl.pointers[index]
        }
        return true
    }
}
