export class Queue<T> {
    max_length: number
    arr: T[]
    front: number
    rear: number

    constructor(max_length: number) {
        this.max_length = max_length
        this.arr = Array(max_length + 1).fill(undefined)
        this.front = 0
        this.rear = 0
    }

    add(value: T): boolean {
        if (this.is_full()) return false
        this.arr[this.rear] = value
        this.rear = (this.rear + 1) % (this.max_length + 1)
        return true
    }

    leave(): T | undefined {
        if (this.is_empty()) return undefined
        let res = this.arr[this.front]
        this.front = (this.front + 1) % (this.max_length + 1)
        return res
    }

    is_full(): boolean {
        return this.front - this.rear == 1 || (this.front == 0 && this.rear == this.max_length)
    }

    is_empty(): boolean {
        return this.front == this.rear
    }
}