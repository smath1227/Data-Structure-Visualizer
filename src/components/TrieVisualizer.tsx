import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trie } from '../algorithms/trie';
import { computeTriePositions, PositionedTrieNode } from '../algorithms/trieLayout';
import '../index.css';

export function TrieVisualizer() {
    const [trie] = useState(() => new Trie());
    const [positions, setPositions] = useState<PositionedTrieNode[]>([]);
    const [highlightIds, setHighlightIds] = useState<Set<number>>(new Set());
    const [words, setWords] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [speed, setSpeed] = useState(1);
    const BASE_DELAY = 300;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateLayout = () => {
        setPositions(computeTriePositions(trie.root));
        setWords(trie.words());
    };

    const handleInsert = async () => {
        const word = inputRef.current?.value.trim();
        if (!word) return;
        // highlight path
        let cur = trie.root;
        setHighlightIds(new Set());
        for (const ch of word) {
            await delay(BASE_DELAY / speed);
            updateLayout();
            // find node position id
            // simplistic: recompute then match by label and parent
            // skip precise highlight for brevity
        }
        trie.insert(word);
        await delay(BASE_DELAY / speed);
        updateLayout();
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDelete = () => {
        const word = inputRef.current?.value.trim();
        if (!word) return;
        trie.delete(word);
        updateLayout();
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleClear = () => {
        trie.clear();
        setPositions([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <>
            <div className="controls">
                <input type="text" placeholder="Enter word" ref={inputRef} />
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

            <div className="traversal-buttons">
                <button onClick={() => setShowModal(true)}>Show Words</button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <h4>All Words</h4>
                        <p>[{words.join(', ')}]</p>
                    </div>
                </div>
            )}

            <div className="svg-container">
                <svg>
                    {positions.map(n => n.parentId !== null && (
                        <motion.line
                            key={`edge-${n.id}`}
                            x1={positions.find(p => p.id === n.parentId)!.x}
                            y1={positions.find(p => p.id === n.parentId)!.y}
                            x2={n.x}
                            y2={n.y}
                            stroke="#555"
                            strokeWidth={2}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                    ))}
                    {positions.map(n => (
                        <motion.g
                            key={`node-${n.id}`}
                            initial={{ x: n.x, y: n.y, scale: 0.8, opacity: 0 }}
                            animate={{ x: n.x, y: n.y, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <circle
                                r={20}
                                fill={highlightIds.has(n.id) ? '#ffe58f' : '#e6f7ff'}
                                stroke={highlightIds.has(n.id) ? '#d48806' : '#69c0ff'}
                                strokeWidth={2}
                            />
                            <text textAnchor="middle" y={5} fontSize={14} fill="#000">
                                {n.label}
                            </text>
                        </motion.g>
                    ))}
                </svg>
            </div>

        </>
    );
}
