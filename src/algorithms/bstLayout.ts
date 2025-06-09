import { BSTNode } from "./bst";

export interface PositionedNode {
    key: number;
    x: number;
    y: number;
    parentKey: number | null;
}

export function computeBSTPositions(root: BSTNode | null): PositionedNode[] {
    const nodes: PositionedNode[] = [];
    let counter = 0;
    const H_SPACING = 60;
    const V_SPACING = 50;
    const CONTAINER_WIDTH = window.innerWidth;

    function dfs(node: BSTNode | null, depth: number, parentKey: number | null) {
        if (!node) return;
        dfs(node.left, depth + 1, node.key);
        const x = counter * H_SPACING;
        const y = depth * V_SPACING + 50;
        nodes.push({ key: node.key, x, y, parentKey });
        counter++;
        dfs(node.right, depth + 1, node.key);
    }

    dfs(root, 0, null);

    // Center the tree
    if (nodes.length) {
        const xs = nodes.map(n => n.x);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const offset = (CONTAINER_WIDTH - (maxX - minX)) / 2 - minX;
        nodes.forEach(n => (n.x += offset));
    }

    return nodes;
}