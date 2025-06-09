// src/algorithms/trieLayout.ts

import { TrieNode } from './trie';

export interface PositionedTrieNode {
    id: number;
    label: string;
    x: number;
    y: number;
    parentId: number | null;
}

export function computeTriePositions(root: TrieNode): PositionedTrieNode[] {
    const nodes: PositionedTrieNode[] = [];
    let nextId = 0;

    // 1) Helper type now includes x and y
    interface Helper {
        orig: TrieNode;
        id: number;
        leafCount: number;
        children: Helper[];
        parentId: number | null;
        x: number;
        y: number;
    }

    // 2) Build the helper tree
    const buildHelpers = (n: TrieNode, parentId: number | null): Helper => {
        const h: Helper = {
            orig: n,
            id: nextId++,
            leafCount: 0,
            children: [],
            parentId,
            x: 0,
            y: 0,
        };
        n.children.forEach(child => {
            h.children.push(buildHelpers(child, h.id));
        });
        return h;
    };
    const helperRoot = buildHelpers(root, null);

    // 3) Compute leafCount for centering subtrees
    const computeLeafCount = (h: Helper): number => {
        if (h.children.length === 0) {
            h.leafCount = 1;
        } else {
            h.leafCount = h.children.reduce((sum, c) => sum + computeLeafCount(c), 0);
        }
        return h.leafCount;
    };
    computeLeafCount(helperRoot);

    // 4) Assign x/y by an in-order positioning of leaves
    let nextX = 0;
    const H_SPACING = 60;
    const V_SPACING = 70;

    const assignXY = (h: Helper, depth: number) => {
        if (h.children.length === 0) {
            // leaf
            h.x = nextX * H_SPACING;
            nextX++;
        } else {
            // internal: position children first
            h.children.forEach(c => assignXY(c, depth + 1));
            // center this node above its children
            const first = h.children[0];
            const last  = h.children[h.children.length - 1];
            h.x = (first.x + last.x) / 2;
        }
        h.y = depth * V_SPACING + 40;
    };
    assignXY(helperRoot, 0);

    // 5) Flatten into PositionedTrieNode[]
    const flatten = (h: Helper) => {
        nodes.push({
            id:      h.id,
            label:   h.orig.char === '' ? '•' : h.orig.char,
            x:       h.x,
            y:       h.y,
            parentId:h.parentId,
        });
        h.children.forEach(flatten);
    };
    flatten(helperRoot);

    // 6) Finally, shift so root is centered
    if (nodes.length) {
        const rootPos = nodes.find(n => n.parentId === null)!;
        const CW = window.innerWidth;
        const offset = CW / 2 - rootPos.x;
        nodes.forEach(n => (n.x += offset));
    }

    return nodes;
}
