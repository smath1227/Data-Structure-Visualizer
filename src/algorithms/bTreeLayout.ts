import { BTreeNode } from './bTree';

export interface PositionedNodeBT {
    id: number;
    label: string;
    x: number;
    y: number;
    parentId: number | null;
}

export function computeBTreePositions(root: BTreeNode): PositionedNodeBT[] {
    const nodes: PositionedNodeBT[] = [];
    let nextId = 0;
    const H_SPACING = 100;
    const V_SPACING = 60;

    interface Helper {
        node: BTreeNode;
        id: number;
        children: Helper[];
        parentId: number | null;
        x: number;
        y: number;
    }

    const build = (n: BTreeNode, pid: number | null): Helper => {
        const h: Helper = { node: n, id: nextId++, children: [], parentId: pid, x: 0, y: 0 };
        n.children.forEach(c => h.children.push(build(c, h.id)));
        return h;
    };
    const hRoot = build(root, null);

    const assign = (h: Helper, depth: number) => {
        if (h.children.length === 0) {
            h.x = nextId * H_SPACING;
            nextId++;
        } else {
            h.children.forEach(c => assign(c, depth + 1));
            h.x = (h.children[0].x + h.children[h.children.length - 1].x) / 2;
        }
        h.y = depth * V_SPACING + 40;
    };
    assign(hRoot, 0);

    const flat = (h: Helper) => {
        nodes.push({ id: h.id, label: h.node.keys.join(', '), x: h.x, y: h.y, parentId: h.parentId });
        h.children.forEach(flat);
    };
    flat(hRoot);

    const rootPos = nodes.find(n => n.parentId === null)!;
    const CW = window.innerWidth;
    const offset = CW / 2 - rootPos.x;
    nodes.forEach(n => n.x += offset);

    return nodes;
}
