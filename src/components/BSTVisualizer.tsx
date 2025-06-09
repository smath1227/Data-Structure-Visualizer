import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BST, BSTNode } from "../algorithms/bst";
import { computeBSTPositions, PositionedNode } from "../algorithms/bstLayout";
import "../index.css";

const BASE_DELAY = 600;
const MAX_FAST_SPEED = 3;

export function BSTVisualizer() {
    const [tree] = useState(() => new BST());
    const [positions, setPositions] = useState<PositionedNode[]>([]);
    const [highlightKey, setHighlightKey] = useState<number | null>(null);
    const [compareText, setCompareText] = useState<string>("");
    const [speed, setSpeed] = useState<number>(1);
    const [travs, setTravs] = useState<{ in: number[]; pre: number[]; post: number[]; lvl: number[] }>({
        in: [],
        pre: [],
        post: [],
        lvl: []
    });
    const [showModal, setShowModal] = useState<{ title: string; data: number[] } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateAll = () => {
        setPositions(computeBSTPositions(tree.root));
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

        if (speed < MAX_FAST_SPEED) {
            let cur: BSTNode | null = tree.root;
            while (cur) {
                const cmp = `${key} ${key < cur.key ? '<' : key > cur.key ? '>' : '='} ${cur.key}`;
                setHighlightKey(cur.key);
                setCompareText(cmp);
                await delay(BASE_DELAY / speed);
                if (key < cur.key) cur = cur.left;
                else if (key > cur.key) cur = cur.right;
                else break;
            }
            setHighlightKey(null);
            setCompareText("");
        }

        tree.insert(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDelete = async () => {
        const key = Number(inputRef.current?.value);
        if (isNaN(key)) return;

        if (speed < MAX_FAST_SPEED) {
            const path: BSTNode[] = [];
            let cur: BSTNode | null = tree.root;
            while (cur) {
                path.push(cur);
                if (key < cur.key) cur = cur.left;
                else if (key > cur.key) cur = cur.right;
                else break;
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
        }

        tree.delete(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <>
            <div className="controls">
                <input type="number" placeholder="Enter integer" ref={inputRef} />
                <button onClick={handleInsert}>Insert</button>
                <button onClick={handleDelete}>Delete</button>
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
                <button onClick={() => setShowModal({ title: 'In-order', data: travs.in })}>
                    In-order
                </button>
                <button onClick={() => setShowModal({ title: 'Pre-order', data: travs.pre })}>
                    Pre-order
                </button>
                <button onClick={() => setShowModal({ title: 'Post-order', data: travs.post })}>
                    Post-order
                </button>
                <button onClick={() => setShowModal({ title: 'Level-order', data: travs.lvl })}>
                    Level-order
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(null)}>
                            ×
                        </button>
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
                            initial={{ x: node.x, y: node.y, scale: 0.9, opacity: 0 }}
                            animate={{ x: node.x, y: node.y, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <circle
                                r={20}
                                fill={node.key === highlightKey ? '#ffe58f' : '#fff'}
                                stroke={node.key === highlightKey ? '#d48806' : '#333'}
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