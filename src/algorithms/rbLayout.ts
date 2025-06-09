// src/algorithms/rbLayout.ts

import { computeBSTPositions, PositionedNode } from "./bstLayout";
import { BSTNode } from "./bst";
import { RBNode } from "./rb";    // ← updated from './rbt' to './rb'

export interface PositionedNodeRB {
    key: number;
    color: "RED" | "BLACK";
    x: number;
    y: number;
    parentKey: number | null;
}

export function computeRBPositions(root: RBNode | null): PositionedNodeRB[] {
    // 1) Build a map from key → color
    const colorMap = new Map<number, "RED" | "BLACK">();
    (function traverse(node: RBNode | null) {
        if (!node) return;
        colorMap.set(node.key, node.color);
        traverse(node.left);
        traverse(node.right);
    })(root);

    // 2) Compute positions using existing BST layout (cast RBNode to BSTNode)
    const bstPositions: PositionedNode[] = computeBSTPositions(
        root as unknown as BSTNode
    );

    // 3) Merge in color info
    return bstPositions.map((p) => ({
        key:       p.key,
        color:     colorMap.get(p.key) || "BLACK",
        x:         p.x,
        y:         p.y,
        parentKey: p.parentKey,
    }));
}
