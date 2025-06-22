/**
 * B-Tree implementation with configurable maxDegree and optional preemptive splitting.
 *
 * maxDegree: Maximum number of keys a node can hold before splitting.
 *   e.g., maxDegree = 3 ⇒ split when a third key is added.
 * preemptiveSplit: If true, splits full child nodes on the way down.
 *   Only supported when maxDegree is even.
 */

export class BTreeNode {
    maxDegree: number;
    keys: number[] = [];
    children: BTreeNode[] = [];
    leaf: boolean;

    constructor(maxDegree: number, leaf: boolean) {
        this.maxDegree = maxDegree;
        this.leaf = leaf;
    }
}

export class BTree {
    root: BTreeNode;
    preemptiveSplit: boolean;

    /**
     * @param maxDegree Maximum number of keys per node before requiring a split.
     * @param preemptiveSplit Whether to split full children on descent (requires even maxDegree).
     */
    constructor(maxDegree: number, preemptiveSplit: boolean = false) {
        if (maxDegree % 2 !== 0) {
            this.preemptiveSplit = true;
        } else {
            this.preemptiveSplit = preemptiveSplit;
        }

        this.root = new BTreeNode(maxDegree, true);
    }

    /**
     * Clears the entire tree.
     */
    clear(): void {
        this.root = new BTreeNode(this.root.maxDegree, true);
    }

    /**
     * Inserts a key into the B-Tree.
     */
    insert(key: number): void {
        let r = this.root;

        if (this.preemptiveSplit) {
            // preemptive: split as soon as root would exceed maxDegree–1 keys
            if (r.keys.length >= r.maxDegree - 1) {
                const s = new BTreeNode(r.maxDegree, false);
                s.children.push(r);
                this.splitChild(s, 0);
                this.root = s;
            }
        } else {
            // post-overflow: split only when root actually has maxDegree keys
            if (r.keys.length >= r.maxDegree) {
                const s = new BTreeNode(r.maxDegree, false);
                s.children.push(r);
                this.splitChild(s, 0);
                this.root = s;
            }
        }

        this.insertNonFull(this.root, key);
    }

    /**
     * Splits child node at index of parent.
     */
    private splitChild(parent: BTreeNode, index: number): void {
        const maxDeg = parent.maxDegree;
        const child = parent.children[index];
        const mid = Math.floor(maxDeg / 2);
        const sibling = new BTreeNode(maxDeg, child.leaf);

        // Median key to promote
        const median = child.keys[mid];

        // Keys after median go to sibling
        sibling.keys = child.keys.splice(mid + 1);
        // Remove median from child
        child.keys.splice(mid, 1);

        // If internal node, split children pointers
        if (!child.leaf) {
            sibling.children = child.children.splice(mid + 1);
        }

        // Insert sibling and median into parent
        parent.children.splice(index + 1, 0, sibling);
        parent.keys.splice(index, 0, median);
    }

    /**
     * Helper for insert: ensure node is non-full.
     */
    private insertNonFull(node: BTreeNode, key: number): void {
        let i = node.keys.length - 1;

        if (node.leaf) {
            // straightforward leaf insertion
            node.keys.push(key);
            while (i >= 0 && node.keys[i] > key) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;

        } else {
            // find child index
            while (i >= 0 && node.keys[i] > key) {
                i--;
            }
            i++;
            const child = node.children[i];

            if (this.preemptiveSplit) {
                // split preemptively when child is about to hit maxDegree
                if (child.keys.length >= child.maxDegree - 1) {
                    this.splitChild(node, i);
                    if (key > node.keys[i]) i++;
                }
            } else {
                // split only once the child truly overflows
                if (child.keys.length >= child.maxDegree) {
                    this.splitChild(node, i);
                    if (key > node.keys[i]) i++;
                }
            }

            this.insertNonFull(node.children[i], key);
        }
    }

    /**
     * Searches for a key, returning true if found.
     */
    search(key: number, node: BTreeNode = this.root): boolean {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        if (i < node.keys.length && key === node.keys[i]) {
            return true;
        }
        if (node.leaf) {
            return false;
        }
        return this.search(key, node.children[i]);
    }

    /**
     * In-order traversal of all keys.
     */
    inorderTraversal(): number[] {
        const res: number[] = [];
        const recurse = (n: BTreeNode) => {
            for (let j = 0; j < n.keys.length; j++) {
                if (!n.leaf) recurse(n.children[j]);
                res.push(n.keys[j]);
            }
            if (!n.leaf) recurse(n.children[n.keys.length]);
        };
        recurse(this.root);
        return res;
    }

    /**
     * Returns all keys in sorted order.
     */
    toArray(): number[] {
        return this.inorderTraversal();
    }

    /**
     * Deletes a key by rebuilding without it (simplest approach).
     * For full B-Tree delete, implement proper merge/borrow logic.
     */
    delete(key: number): void {
        const all = this.inorderTraversal().filter(k => k !== key);
        this.clear();
        for (const k of all) {
            this.insert(k);
        }
    }
}
