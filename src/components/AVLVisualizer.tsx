import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AVL, AVLNode } from "../algorithms/avl";
import { computeAVLPositions, PositionedNode } from "../algorithms/avlLayout";
import "../index.css";

const BASE_DELAY = 600;
const MAX_FAST_SPEED = 3;

export function AVLVisualizer() {
    const [tree] = useState(() => new AVL());
    const [positions, setPositions] = useState<PositionedNode[]>([]);
    const [highlightKey, setHighlightKey] = useState<number | null>(null);
    const [compareText, setCompareText] = useState<string>("");
    const [speed, setSpeed] = useState<number>(1);
    const [travs, setTravs] = useState<{ in: number[]; pre: number[]; post: number[]; lvl: number[] }>({ in: [], pre: [], post: [], lvl: [] });
    const [showModal, setShowModal] = useState<{ title: string; data: number[] } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateAll = () => {
        setPositions(computeAVLPositions(tree.root));
        setTravs({
            in: tree.inorder(),
            pre: tree.preOrder(),
            post: tree.postOrder(),
            lvl: tree.levelOrder()
        });
    };

    const handleInsert = async () => {
        const key = Number(inputRef.current?.value);
        if (isNaN(key)) return;
        let cur: AVLNode | null = tree.root;
        while (cur && speed < MAX_FAST_SPEED) {
            const cmp = `${key} ${key < cur.key ? '<' : key > cur.key ? '>' : '='} ${cur.key}`;
            setHighlightKey(cur.key);
            setCompareText(cmp);
            await delay(BASE_DELAY / speed);
            cur = key < cur.key ? cur.left : key > cur.key ? cur.right : null;
        }
        setHighlightKey(null);
        setCompareText("");

        tree.insert(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDelete = async () => {
        const key = Number(inputRef.current?.value);
        if (isNaN(key)) return;
        let cur: AVLNode | null = tree.root;
        const path: AVLNode[] = [];
        while (cur) {
            path.push(cur);
            cur = key < cur.key ? cur.left : key > cur.key ? cur.right : null;
        }
        for (let i = path.length - 1; i >= 0; i--) {
            const n = path[i];
            const cmp = `${key} ${key < n.key ? '<' : key > n.key ? '>' : '='} ${n.key}`;
            setHighlightKey(n.key);
            setCompareText(cmp);
            await delay(BASE_DELAY / speed);
        }
        setHighlightKey(null);
        setCompareText("");

        tree.delete(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleClear = () => {
        tree.clear();
        setPositions([]);
        setTravs({ in: [], pre: [], post: [], lvl: [] });
        setHighlightKey(null);
        setCompareText("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <>
            <div className="controls">
                <input type="number" placeholder="Enter integer" ref={inputRef} />
                <button onClick={handleInsert}>Insert</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleClear}>Clear</button>
                <div className="slider">
                    <label>Speed:</label>
                    <input
                        type="range"
                        min={0.1}
                        max={MAX_FAST_SPEED}
                        step={0.1}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                    />
                    <span>{speed.toFixed(1)}x</span>
                </div>
            </div>
            {compareText && <div className="compare-text">Comparing: {compareText}</div>}
            <div className="traversal-buttons">
                <button onClick={() => setShowModal({ title: 'In-order', data: travs.in })}>In-order</button>
                <button onClick={() => setShowModal({ title: 'Pre-order', data: travs.pre })}>Pre-order</button>
                <button onClick={() => setShowModal({ title: 'Post-order', data: travs.post })}>Post-order</button>
                <button onClick={() => setShowModal({ title: 'Level-order', data: travs.lvl })}>Level-order</button>
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
                        <h4>{showModal.title}</h4>
                        <p>[{showModal.data.join(', ')}]</p>
                    </div>
                </div>
            )}
            <div className="svg-container">
                <svg>
                    {/* Edges */}
                    {positions.map(node => {
                        if (node.parentKey === null) return null;
                        const parent = positions.find(p => p.key === node.parentKey);
                        if (!parent) return null;
                        return (
                            <motion.line
                                key={`edge-${node.key}`}
                                x1={parent.x}
                                y1={parent.y}
                                x2={node.x}
                                y2={node.y}
                                stroke="#555"
                                strokeWidth={2}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        );
                    })}
                    {/* Nodes */}
                    {positions.map(node => (
                        <motion.g
                            key={`node-${node.key}`}
                            initial={{ x: node.x, y: node.y, scale: 0.8, opacity: 0 }}
                            animate={{ x: node.x, y: node.y, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <circle
                                r={20}
                                fill={highlightKey === node.key ? '#ffe58f' : '#fff'}
                                stroke={highlightKey === node.key ? '#d48806' : '#333'}
                                strokeWidth={2}
                            />
                            <text textAnchor="middle" y={5} fontSize={14} fill="#000">
                                {node.key}
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>
        </>
    );
}