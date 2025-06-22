// src/components/BTreeVisualizer.tsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BTree } from "../algorithms/bTree";
import { computeBTreePositions, PositionedNodeBT } from "../algorithms/bTreeLayout";
import "../index.css";

const BTREE_BASE_DELAY = 600;
const BTREE_MAX_SPEED = 3;

export function BTreeVisualizer() {
    const [maxDegree, setMaxDegree] = useState<number>(3);
    const [preemptiveSplit, setPreemptiveSplit] = useState<boolean>(false);
    const [btree, setBTree] = useState(() => new BTree(maxDegree, preemptiveSplit));
    const [positions, setPositions] = useState<PositionedNodeBT[]>([]);
    const [speed, setSpeed] = useState<number>(1);
    const inputRef = useRef<HTMLInputElement>(null);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateAll = () => setPositions(computeBTreePositions(btree.root));

    const resetTree = (degree: number, preempt: boolean) => {
        setBTree(new BTree(degree, preempt));
        setPositions([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let deg = parseInt(e.target.value, 10);
        if (isNaN(deg) || deg < 2) deg = 2;
        const isOdd = deg % 2 !== 0;
        setMaxDegree(deg);
        if (isOdd) {
            setPreemptiveSplit(true);
            resetTree(deg, true);
        } else {
            resetTree(deg, preemptiveSplit);
        }
    };

    const handlePreemptiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (maxDegree % 2 !== 0) return;
        const checked = e.target.checked;
        setPreemptiveSplit(checked);
        resetTree(maxDegree, checked);
    };

    const handleInsert = async () => {
        const key = Number(inputRef.current?.value);
        if (isNaN(key)) return;
        if (speed < BTREE_MAX_SPEED) await delay(BTREE_BASE_DELAY / speed);
        btree.insert(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDelete = async () => {
        const key = Number(inputRef.current?.value);
        if (isNaN(key)) return;
        if (speed < BTREE_MAX_SPEED) await delay(BTREE_BASE_DELAY / speed);
        btree.delete(key);
        updateAll();
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleClear = () => {
        btree.clear();
        setPositions([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <>
            <div className="controls">
                <label>Max Degree:</label>
                <input
                    type="number"
                    min={2}
                    value={maxDegree}
                    onChange={handleDegreeChange}
                />
                <label>Preemptive split:</label>
                <input
                    type="checkbox"
                    checked={preemptiveSplit}
                    disabled={maxDegree % 2 !== 0}
                    onChange={handlePreemptiveChange}
                />

                <input type="number" placeholder="Key" ref={inputRef} />
                <button onClick={handleInsert}>Insert</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleClear}>Clear</button>

                <div className="slider">
                    <label>Speed:</label>
                    <input
                        type="range"
                        min={0.1}
                        max={BTREE_MAX_SPEED}
                        step={0.1}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                    />
                    <span>{speed.toFixed(1)}x</span>
                </div>
            </div>

            <div className="svg-container">
                <svg>
                    {/* edges */}
                    {positions.map(node => {
                        if (node.parentId === null) return null;
                        const parent = positions.find(p => p.id === node.parentId);
                        if (!parent) return null;
                        return (
                            <motion.line
                                key={`edge-${parent.id}-${node.id}`}
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
                    {/* nodes */}
                    {positions.map(node => (
                        <motion.g
                            key={`node-${node.id}`}
                            initial={{ x: node.x, y: node.y, scale: 0.9, opacity: 0 }}
                            animate={{ x: node.x, y: node.y, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <rect
                                x={-node.label.split(", ").length * 15}
                                y={-20}
                                width={node.label.split(", ").length * 30}
                                height={40}
                                fill="#fff"
                                stroke="#333"
                                strokeWidth={2}
                                rx={4}
                            />
                            <text textAnchor="middle" y={5} fontSize={14} fill="#000">
                                {node.label}
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>
        </>
    );
}
