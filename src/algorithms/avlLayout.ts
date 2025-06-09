import { AVLNode } from "./avl";

export interface PositionedNode {
    key: number;
    x: number;
    y: number;
    parentKey: number | null;
}

export function computeAVLPositions(root: AVLNode | null): PositionedNode[] {
    const nodes: PositionedNode[] = [];
    let counter = 0;
    const H_SPACING = 60;
    const V_SPACING = 50;
    const CW = window.innerWidth;

    function dfs(n: AVLNode | null, depth: number, pKey: number | null) {
        if (!n) return;
        dfs(n.left, depth + 1, n.key);
        nodes.push({ key: n.key, x: counter * H_SPACING, y: depth * V_SPACING + 50, parentKey: pKey });
        counter++;
        dfs(n.right, depth + 1, n.key);
    }

    dfs(root, 0, null);

    // center
    if (nodes.length) {
        const xs = nodes.map(n => n.x);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const offset = (CW - (maxX - minX)) / 2 - minX;
        nodes.forEach(n => (n.x += offset));
    }

    return nodes;
}
