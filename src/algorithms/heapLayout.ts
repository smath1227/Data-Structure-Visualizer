// src/algorithms/heapLayout.ts

export interface PositionedHeapNode {
    index: number;         // array index of the node
    value: number;         // the value stored at that index
    x: number;             // x-coordinate for SVG positioning
    y: number;             // y-coordinate for SVG positioning
    parentIndex: number | null; // index of the parent node (null for root)
}

export function computeHeapPositions(data: number[]): PositionedHeapNode[] {
    const nodes: PositionedHeapNode[] = [];
    const V_SPACING = 70;                 // vertical distance between levels
    const TOTAL_WIDTH = window.innerWidth; // use the full viewport width

    let level = 0;
    let count = data.length;

    // Continue as long as there are nodes at this level
    while (2 ** level <= count) {
        const start = 2 ** level - 1;
        const end   = Math.min(2 ** (level + 1) - 1, count);
        const numNodes = end - start;
        const hSpacing = TOTAL_WIDTH / (numNodes + 1);

        for (let i = start; i < end; i++) {
            const posInLevel = i - start + 1;
            const x = hSpacing * posInLevel;
            const y = level * V_SPACING + 40;
            const parentIdx = i === 0 ? null : Math.floor((i - 1) / 2);
            nodes.push({
                index: i,
                value: data[i],
                x,
                y,
                parentIndex: parentIdx
            });
        }

        level++;
    }

    return nodes;
}
