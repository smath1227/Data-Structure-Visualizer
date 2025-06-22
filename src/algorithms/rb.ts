// src/algorithms/rbt.ts

export type Color = 'RED' | 'BLACK';

export interface RBNode {
    key: number;
    color: Color;
    left: RBNode | null;
    right: RBNode | null;
    parent: RBNode | null;
}

const RED: Color = 'RED';
const BLACK: Color = 'BLACK';

export class RedBlackTree {
    root: RBNode | null = null;

    insert(key: number): void {
        const z: RBNode = { key, color: RED, left: null, right: null, parent: null };
        this.bstInsert(z);
        this.fixInsert(z);
    }

    delete(key: number): void {
        let z = this.root;
        while (z && z.key !== key) {
            z = key < z.key ? z.left : z.right;
        }
        if (z) this.deleteNode(z);
    }

    clear(): void {
        this.root = null;
    }

    // ── Traversals ──
    inorder(): number[] {
        const res: number[] = [];
        (function dfs(n: RBNode | null) {
            if (!n) return;
            dfs(n.left);
            res.push(n.key);
            dfs(n.right);
        })(this.root);
        return res;
    }

    preOrder(): number[] {
        const res: number[] = [];
        (function dfs(n: RBNode | null) {
            if (!n) return;
            res.push(n.key);
            dfs(n.left);
            dfs(n.right);
        })(this.root);
        return res;
    }

    postOrder(): number[] {
        const res: number[] = [];
        (function dfs(n: RBNode | null) {
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
        const q: RBNode[] = [this.root];
        while (q.length) {
            const n = q.shift()!;
            res.push(n.key);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
        return res;
    }

    // ── Private Helpers ──

    private bstInsert(z: RBNode) {
        let y: RBNode | null = null;
        let x = this.root;
        while (x) {
            y = x;
            if (z.key < x.key)       x = x.left;
            else if (z.key > x.key)  x = x.right;
            else                     return; // duplicate, skip
        }
        z.parent = y;
        if (!y)       this.root = z;
        else if (z.key < y.key) y.left  = z;
        else                     y.right = z;
    }

    private fixInsert(z: RBNode) {
        while (z.parent?.color === RED) {
            const p = z.parent;
            const g = p.parent!;
            if (p === g.left) {
                const u = g.right;
                if (u?.color === RED) {
                    p.color = BLACK; u.color = BLACK; g.color = RED;
                    z = g;
                } else {
                    if (z === p.right) {
                        z = p;
                        this.rotateLeft(z);
                    }
                    p.color = BLACK;
                    g.color = RED;
                    this.rotateRight(g);
                }
            } else {
                const u = g.left;
                if (u?.color === RED) {
                    p.color = BLACK; u.color = BLACK; g.color = RED;
                    z = g;
                } else {
                    if (z === p.left) {
                        z = p;
                        this.rotateRight(z);
                    }
                    p.color = BLACK;
                    g.color = RED;
                    this.rotateLeft(g);
                }
            }
        }
        if (this.root) this.root.color = BLACK;
    }

    private deleteNode(z: RBNode) {
        let y = z;
        const origColor = y.color;
        let x: RBNode | null;
        let xParent: RBNode | null;

        if (!z.left) {
            x = z.right;
            xParent = z.parent;
            this.transplant(z, z.right);
        } else if (!z.right) {
            x = z.left;
            xParent = z.parent;
            this.transplant(z, z.left);
        } else {
            // two children: find successor
            y = this.minimum(z.right);
            const yColor = y.color;
            x = y.right;
            if (y.parent === z) {
                xParent = y;
            } else {
                xParent = y.parent;
                this.transplant(y, y.right);
                y.right = z.right;
                if (y.right) y.right.parent = y;
            }
            this.transplant(z, y);
            y.left = z.left;
            if (y.left) y.left.parent = y;
            y.color = z.color;
            xParent = y;
            if (yColor === BLACK) {
                this.fixDelete(x, xParent);
            }
            return;
        }

        if (origColor === BLACK) {
            this.fixDelete(x, xParent);
        }
    }

    private fixDelete(x: RBNode | null, parent: RBNode | null) {
        while (x !== this.root && this.getColor(x) === BLACK) {
            if (x === parent?.left) {
                let w = parent.right;

                // Case 1: sibling is red
                if (this.getColor(w) === RED) {
                    if (w) w.color = BLACK;
                    parent.color = RED;
                    this.rotateLeft(parent);
                    w = parent.right;
                }

                // Case 2: both of sibling’s children are black
                if (
                    this.getColor(w?.left ?? null) === BLACK &&
                    this.getColor(w?.right ?? null) === BLACK
                ) {
                    if (w) w.color = RED;
                    x = parent;
                    parent = x.parent;
                } else {
                    // Case 3: sibling’s right child is black
                    if (this.getColor(w?.right ?? null) === BLACK) {
                        if (w?.left) w.left.color = BLACK;
                        if (w) w.color = RED;
                        this.rotateRight(w!);
                        w = parent.right;
                    }
                    // Case 4: sibling’s right child is red
                    if (w) w.color = parent.color;
                    parent.color = BLACK;
                    if (w?.right) w.right.color = BLACK;
                    this.rotateLeft(parent);
                    x = this.root;
                }
            } else {
                // mirror image of above “if”
                let w = parent!.left;

                if (this.getColor(w) === RED) {
                    if (w) w.color = BLACK;
                    parent!.color = RED;
                    this.rotateRight(parent!);
                    w = parent!.left;
                }

                if (
                    this.getColor(w?.right ?? null) === BLACK &&
                    this.getColor(w?.left  ?? null) === BLACK
                ) {
                    if (w) w.color = RED;
                    x = parent!;
                    parent = x.parent;
                } else {
                    if (this.getColor(w?.left ?? null) === BLACK) {
                        if (w?.right) w.right.color = BLACK;
                        if (w) w.color = RED;
                        this.rotateLeft(w!);
                        w = parent!.left;
                    }
                    if (w) w.color = parent!.color;
                    parent!.color = BLACK;
                    if (w?.left) w.left.color = BLACK;
                    this.rotateRight(parent!);
                    x = this.root;
                }
            }
        }

        // Finally, ensure x is black
        if (x) x.color = BLACK;
    }


    private minimum(n: RBNode): RBNode {
        while (n.left) n = n.left;
        return n;
    }

    private transplant(u: RBNode, v: RBNode | null) {
        if (!u.parent) this.root = v;
        else if (u === u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        if (v) v.parent = u.parent;
    }

    private getColor(n: RBNode | null): Color {
        return n ? n.color : BLACK;
    }

    private rotateLeft(x: RBNode) {
        const y = x.right!;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    private rotateRight(x: RBNode) {
        const y = x.left!;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x === x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }
}
