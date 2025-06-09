// src/algorithms/trie.ts

export interface TrieNode {
    char: string;
    children: Map<string, TrieNode>;
    parent: TrieNode | null;
    isEnd: boolean;
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = {
            char: '',
            children: new Map(),
            parent: null,
            isEnd: false
        };
    }

    insert(word: string): void {
        let node = this.root;
        for (const ch of word) {
            if (!node.children.has(ch)) {
                const child: TrieNode = {
                    char: ch,
                    children: new Map(),
                    parent: node,
                    isEnd: false
                };
                node.children.set(ch, child);
            }
            node = node.children.get(ch)!;
        }
        node.isEnd = true;
    }

    delete(word: string): void {
        const found = this._findNode(word);
        if (!found || !found.isEnd) return;

        // unmark end
        found.isEnd = false;

        // prune back up while leaf & not an endpoint
        let cur = found;                          // cur is always TrieNode
        while (!cur.isEnd && cur.children.size === 0 && cur.parent) {
            const p = cur.parent!;                  // assert non-null
            p.children.delete(cur.char);
            cur = p;
        }
    }

    words(): string[] {
        const res: string[] = [];
        const dfs = (n: TrieNode, path: string[]) => {
            if (n.isEnd) res.push(path.join(''));
            // use Map.forEach instead of for-of
            n.children.forEach((child, ch) => {
                path.push(ch);
                dfs(child, path);
                path.pop();
            });
        };
        dfs(this.root, []);
        return res;
    }

    private _findNode(word: string): TrieNode | null {
        let node = this.root;
        for (const ch of word) {
            if (!node.children.has(ch)) return null;
            node = node.children.get(ch)!;
        }
        return node;
    }
}
