export interface AVLNode {
    key: number;
    left: AVLNode | null;
    right: AVLNode | null;
    height: number;
}

export class AVL {
    root: AVLNode | null = null;

    insert(key: number): void {
        this.root = this._insert(this.root, key);
    }

    delete(key: number): void {
        this.root = this._delete(this.root, key);
    }

    clear(): void {
        this.root = null;
    }

    // Traversals
    inorder(): number[] {
        const res: number[] = [];
        (function dfs(n: AVLNode | null) {
            if (!n) return;
            dfs(n.left);
            res.push(n.key);
            dfs(n.right);
        })(this.root);
        return res;
    }

    preOrder(): number[] {
        const res: number[] = [];
        (function dfs(n: AVLNode | null) {
            if (!n) return;
            res.push(n.key);
            dfs(n.left);
            dfs(n.right);
        })(this.root);
        return res;
    }

    postOrder(): number[] {
        const res: number[] = [];
        (function dfs(n: AVLNode | null) {
            if (!n) return;
            dfs(n.left);
            dfs(n.right);
            res.push(n.key);
        })(this.root);
        return res;
    }

    levelOrder(): number[] {
        const res: number[] = [];
        if (!this.root) return res;
        const queue: AVLNode[] = [this.root];
        while (queue.length) {
            const n = queue.shift()!;
            res.push(n.key);
            if (n.left) queue.push(n.left);
            if (n.right) queue.push(n.right);
        }
        return res;
    }

    // ── Private helpers ──

    private height(node: AVLNode | null): number {
        return node ? node.height : 0;
    }

    private updateHeight(node: AVLNode): void {
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    }

    private getBalance(node: AVLNode | null): number {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    private rightRotate(y: AVLNode): AVLNode {
        const x = y.left!;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    private leftRotate(x: AVLNode): AVLNode {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    private _insert(node: AVLNode | null, key: number): AVLNode {
        // Standard BST insert
        if (!node) return { key, left: null, right: null, height: 1 };
        if (key < node.key) node.left = this._insert(node.left, key);
        else if (key > node.key) node.right = this._insert(node.right, key);
        else return node; // duplicates ignored

        // Update height
        this.updateHeight(node);

        // Rebalance
        const balance = this.getBalance(node);

        // LL
        if (balance > 1 && key < node.left!.key) return this.rightRotate(node);
        // RR
        if (balance < -1 && key > node.right!.key) return this.leftRotate(node);
        // LR
        if (balance > 1 && key > node.left!.key) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }
        // RL
        if (balance < -1 && key < node.right!.key) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        return node;
    }

    private _delete(node: AVLNode | null, key: number): AVLNode | null {
        // Standard BST delete
        if (!node) {
            return null;
        }

        if (key < node.key) {
            node.left = this._delete(node.left, key);
        }
        else if (key > node.key) {
            node.right = this._delete(node.right, key);
        }
        else {
            // node to delete
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            // two children
            let succParent = node;
            let succ = node.right;
            while (succ!.left) {
                succParent = succ!;
                succ = succ!.left;
            }
            node.key = succ!.key;
            if (succParent === node) succParent.right = this._delete(succParent.right, succ!.key);
            else succParent.left = this._delete(succParent.left, succ!.key);
        }

        // Update height and rebalance
        this.updateHeight(node);
        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) return this.rightRotate(node);
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.getBalance(node.right) <= 0) return this.leftRotate(node);
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        return node;
    }
}