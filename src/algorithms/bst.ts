export interface BSTNode {
    key: number;
    left: BSTNode | null;
    right: BSTNode | null;
}

export class BST {
    root: BSTNode | null = null;

    insert(key: number): void {
        this.root = this._insertRecursive(this.root, key);
    }

    delete(key: number): void {
        this.root = this._deleteRecursive(this.root, key);
    }

    inorder(): number[] {
        const result: number[] = [];
        (function dfs(node: BSTNode | null) {
            if (!node) return;
            dfs(node.left);
            result.push(node.key);
            dfs(node.right);
        })(this.root);
        return result;
    }

    preOrder(): number[] {
        const result: number[] = [];
        (function dfs(node: BSTNode | null) {
            if (!node) return;
            result.push(node.key);
            dfs(node.left);
            dfs(node.right);
        })(this.root);
        return result;
    }

    postOrder(): number[] {
        const result: number[] = [];
        (function dfs(node: BSTNode | null) {
            if (!node) return;
            dfs(node.left);
            dfs(node.right);
            result.push(node.key);
        })(this.root);
        return result;
    }

    levelOrder(): number[] {
        const result: number[] = [];
        if (!this.root) return result;
        const queue: BSTNode[] = [this.root];
        while (queue.length) {
            const node = queue.shift()!;
            result.push(node.key);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return result;
    }

    private _insertRecursive(node: BSTNode | null, key: number): BSTNode {
        if (!node) {
            return { key, left: null, right: null };
        }
        if (key < node.key) {
            node.left = this._insertRecursive(node.left, key);
        } else if (key > node.key) {
            node.right = this._insertRecursive(node.right, key);
        }
        return node;
    }

    private _deleteRecursive(node: BSTNode | null, key: number): BSTNode | null {
        if (!node) return null;
        if (key < node.key) {
            node.left = this._deleteRecursive(node.left, key);
            return node;
        } else if (key > node.key) {
            node.right = this._deleteRecursive(node.right, key);
            return node;
        } else {
            // Node to delete found
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            // Two children: find successor
            let parent = node;
            let successor = node.right;
            while (successor.left) {
                parent = successor;
                successor = successor.left;
            }
            node.key = successor.key;
            if (parent === node) {
                parent.right = this._deleteRecursive(parent.right, successor.key);
            } else {
                parent.left = this._deleteRecursive(parent.left, successor.key);
            }
            return node;
        }
    }
}