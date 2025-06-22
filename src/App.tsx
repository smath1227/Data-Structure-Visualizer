import React, { useState } from "react";
import { BSTVisualizer } from "./components/BSTVisualizer";
import { AVLVisualizer } from "./components/AVLVisualizer";
import { RBVisualizer }  from "./components/RBVisualizer";
import { TrieVisualizer } from "./components/TrieVisualizer";
import { HeapVisualizer } from "./components/HeapVisualizer";
import { BTreeVisualizer } from "./components/bTreeVisualizer";
import "./index.css";

const pageNames = {
    BST: "Binary Search Tree",
    AVL: "AVL Tree",
    RB:  "Red-Black Tree",
    TR:  "Trie",
    HP: "Heap",
    BT: "B-Tree",
} as const;

export default function App() {
    const [page, setPage] = useState<keyof typeof pageNames>("BST");
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(o => !o);
    const selectPage = (p: keyof typeof pageNames) => {
        setPage(p);
        setMenuOpen(false);
    };

    return (
        <>
            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div />
                <div />
                <div />
            </div>
            <div className={`menu-dropdown ${menuOpen ? "open" : ""}`}>
                <div className="menu-label">Trees</div>
                <button onClick={() => selectPage("AVL")}>AVL Tree</button>
                <button onClick={() => selectPage("BST")}>Binary Search Tree</button>
                <button onClick={() => selectPage("RB")}>Red-Black Tree</button>
                <button onClick={() => selectPage("TR")}>Trie</button>
                <button onClick={() => selectPage("HP")}>Heap</button>
                <button onClick={() => selectPage("BT")}>B-Tree</button>
            </div>
            <h1>{pageNames[page]} Visualizer</h1>
            <main className="main-content">
                {page === "BST" && <BSTVisualizer />}
                {page === "AVL" && <AVLVisualizer />}
                {page === "RB"  && <RBVisualizer  />}
                {page === "TR"  && <TrieVisualizer/>}
                {page === "HP"  && <HeapVisualizer/>}
                {page === "BT"  && <BTreeVisualizer/>}
            </main>
        </>
    );
}
