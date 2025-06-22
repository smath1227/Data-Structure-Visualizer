export interface HeapPathResult {
    path: number[];
    swapped: [number, number][];
}

export class MinHeap {
    data: number[] = [];

    insert(val: number): HeapPathResult {
        const path: number[] = [];
        const swaps: [number, number][] = [];
        this.data.push(val);
        let i = this.data.length - 1;
        path.push(i);

        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            path.push(p);
            if (this.data[i] < this.data[p]) {
                [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
                swaps.push([i, p]);
                i = p;
            } else {
                break;
            }
        }

        return { path, swapped: swaps };
    }

    remove(): { value: number | undefined } & HeapPathResult {
        const path: number[] = [];
        const swaps: [number, number][] = [];
        if (this.data.length === 0) return { value: undefined, path, swapped: swaps };

        const min = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            path.push(i);
            while (true) {
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                let smallest = i;
                if (left < this.data.length && this.data[left] < this.data[smallest]) smallest = left;
                if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;
                if (smallest !== i) {
                    path.push(smallest);
                    [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                    swaps.push([i, smallest]);
                    i = smallest;
                } else {
                    break;
                }
            }
        }

        return { value: min, path, swapped: swaps };
    }

    toArray(): number[] {
        return [...this.data];
    }

    clear(): void {
        this.data = [];
    }
}

export class MaxHeap {
    data: number[] = [];

    insert(val: number): HeapPathResult {
        const path: number[] = [];
        const swaps: [number, number][] = [];
        this.data.push(val);
        let i = this.data.length - 1;
        path.push(i);

        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            path.push(p);
            if (this.data[i] > this.data[p]) {
                [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
                swaps.push([i, p]);
                i = p;
            } else {
                break;
            }
        }

        return { path, swapped: swaps };
    }

    remove(): { value: number | undefined } & HeapPathResult {
        const path: number[] = [];
        const swaps: [number, number][] = [];
        if (this.data.length === 0) return { value: undefined, path, swapped: swaps };

        const max = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            path.push(i);
            while (true) {
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                let largest = i;
                if (left < this.data.length && this.data[left] > this.data[largest]) largest = left;
                if (right < this.data.length && this.data[right] > this.data[largest]) largest = right;
                if (largest !== i) {
                    path.push(largest);
                    [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
                    swaps.push([i, largest]);
                    i = largest;
                } else {
                    break;
                }
            }
        }

        return { value: max, path, swapped: swaps };
    }

    toArray(): number[] {
        return [...this.data];
    }

    clear(): void {
        this.data = [];
    }
}