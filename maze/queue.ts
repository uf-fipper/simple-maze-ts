export class Queue<T> {
  max_length: number;

  arr: T[];

  front: number;

  rear: number;

  constructor(maxLength: number) {
    this.max_length = maxLength;
    this.arr = Array(maxLength + 1).fill(undefined);
    this.front = 0;
    this.rear = 0;
  }

  add(value: T): boolean {
    if (this.is_full()) return false;
    this.arr[this.rear] = value;
    this.rear = (this.rear + 1) % (this.max_length + 1);
    return true;
  }

  leave(): T | undefined {
    if (this.is_empty()) return undefined;
    const res = this.arr[this.front];
    this.front = (this.front + 1) % (this.max_length + 1);
    return res;
  }

  is_full(): boolean {
    return (
      this.front - this.rear === 1 ||
      (this.front === 0 && this.rear === this.max_length)
    );
  }

  is_empty(): boolean {
    return this.front === this.rear;
  }
}
