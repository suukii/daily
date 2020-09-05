class Heap {
    constructor(list = []) {
        this.list = list;
        this.init();
    }

    init() {
        const size = this.size();
        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
            this.heapify(this.list, size, i);
        }
    }

    insert(n) {
        this.list.push(n);
        const size = this.size();
        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
            this.heapify(this.list, size, i);
        }
    }

    peek() {
        return this.list[0];
    }

    pop() {
        const last = this.list.pop();
        if (this.size() === 0) return last;
        const returnItem = this.list[0];
        this.list[0] = last;
        this.heapify(this.list, this.size(), 0);
        return returnItem;
    }

    size() {
        return this.list.length;
    }
}

class MaxHeap extends Heap {
    constructor(list) {
        super(list);
    }

    heapify(arr, size, i) {
        let largest = i;
        const left = Math.floor(i * 2 + 1);
        const right = Math.floor(i * 2 + 2);
        if (left < size && arr[largest] < arr[left]) largest = left;
        if (right < size && arr[largest] < arr[right]) largest = right;

        if (largest !== i) {
            [arr[largest], arr[i]] = [arr[i], arr[largest]];
            this.heapify(arr, size, largest);
        }
    }
}

class MinHeap extends Heap {
    constructor(list) {
        super(list);
    }

    heapify(arr, size, i) {
        let smallest = i;
        const left = Math.floor(i * 2 + 1);
        const right = Math.floor(i * 2 + 2);
        if (left < size && arr[smallest] > arr[left]) smallest = left;
        if (right < size && arr[smallest] > arr[right]) smallest = right;

        if (smallest !== i) {
            [arr[smallest], arr[i]] = [arr[i], arr[smallest]];
            this.heapify(arr, size, smallest);
        }
    }
}
