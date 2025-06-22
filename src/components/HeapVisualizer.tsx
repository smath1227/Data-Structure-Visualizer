import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MinHeap, MaxHeap, HeapPathResult } from '../algorithms/heap';
import { computeHeapPositions, PositionedHeapNode } from '../algorithms/heapLayout';
import '../index.css';

export function HeapVisualizer() {
    const [isMin, setIsMin] = useState(true);
    const [heap, setHeap] = useState<MinHeap | MaxHeap>(new MinHeap());
    const [nodes, setNodes] = useState<PositionedHeapNode[]>([]);
    const [highlightIdx, setHighlightIdx] = useState<Set<number>>(new Set());
    const [compareText, setCompareText] = useState<string>('');
    const [speed, setSpeed] = useState<number>(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const BASE_DELAY = 400;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateNodes = (h: MinHeap | MaxHeap) => {
        setNodes(computeHeapPositions(h.toArray()));
    };

    const transformHeap = (toMin: boolean) => {
        const arr = heap.toArray();
        const newHeap = toMin ? new MinHeap() : new MaxHeap();
        arr.forEach(v => newHeap.insert(v));
        setIsMin(toMin);
        setHeap(newHeap);
        updateNodes(newHeap);
    };

    const handleInsert = async () => {
        const val = Number(inputRef.current?.value);
        if (isNaN(val)) return;
        const result: HeapPathResult = heap.insert(val);

        for (const idx of result.path) {
            setHighlightIdx(new Set([idx]));
            setCompareText(`Visiting index ${idx}`);
            await delay(BASE_DELAY / speed);
        }
        for (const [i, j] of result.swapped) {
            setHighlightIdx(new Set([i, j]));
            setCompareText(`Swapped idx ${i} & ${j}`);
            await delay(BASE_DELAY / speed);
        }

        setHighlightIdx(new Set());
        setCompareText('');
        updateNodes(heap);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDelete = async () => {
        const result = heap.remove();
        if (result.value === undefined) return;

        for (const idx of result.path) {
            setHighlightIdx(new Set([idx]));
            setCompareText(`Visiting index ${idx}`);
            await delay(BASE_DELAY / speed);
        }
        for (const [i, j] of result.swapped) {
            setHighlightIdx(new Set([i, j]));
            setCompareText(`Swapped idx ${i} & ${j}`);
            await delay(BASE_DELAY / speed);
        }

        setHighlightIdx(new Set());
        setCompareText('');
        updateNodes(heap);
    };

    const handleClear = () => {
        heap.clear();
        setNodes([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <>
            <div className="controls">
                <input type="number" placeholder="Enter value" ref={inputRef} />
                <button onClick={handleInsert}>Insert</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleClear}>Clear</button>
                <div className="slider">
                    <label>Speed:</label>
                    <input
                        type="range"
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                    />
                    <span>{speed.toFixed(1)}x</span>
                </div>
            </div>

            {/* min/max toggle */}
            <div className="traversal-buttons">
                <button
                    onClick={() => transformHeap(true)}
                    disabled={isMin}
                >
                    Min-Heap
                </button>
                <button
                    onClick={() => transformHeap(false)}
                    disabled={!isMin}
                >
                    Max-Heap
                </button>
            </div>

            {compareText && <div className="compare-text">{compareText}</div>}

            <div className="svg-container">
                <svg>
                    {nodes.map(n => {
                        if (n.parentIndex === null) return null;
                        const p = nodes.find(x => x.index === n.parentIndex)!;
                        return (
                            <motion.line
                                key={`edge-${n.index}`}
                                x1={p.x}
                                y1={p.y}
                                x2={n.x}
                                y2={n.y}
                                stroke="#555"
                                strokeWidth={2}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        );
                    })}
                    {nodes.map(n => (
                        <motion.g
                            key={`node-${n.index}`}
                            initial={{ x: n.x, y: n.y, scale: 0.8, opacity: 0 }}
                            animate={{ x: n.x, y: n.y, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <circle
                                r={20}
                                fill={highlightIdx.has(n.index) ? '#ffe58f' : '#91d5ff'}
                                stroke={highlightIdx.has(n.index) ? '#d48806' : '#0050b3'}
                                strokeWidth={2}
                            />
                            <text textAnchor="middle" y={5} fontSize={14} fill="#000">
                                {n.value}
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>
        </>
    );
}