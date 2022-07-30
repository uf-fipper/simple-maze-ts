/**
 * 二维坐标点类
 */
export class Point {
    x: number
    y: number

    static zero = new Point(0, 0)

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    /**
     * 返回周围的四个点
     * @returns 返回周围的四个点
     */
    get_range(): Point[] {
        return [
            new Point(this.x - 1, this.y),
            new Point(this.x + 1, this.y),
            new Point(this.x, this.y + 1),
            new Point(this.x, this.y - 1),
        ]
    }

    /**
     * 加法运算
     * @param other 另一个点
     * @returns 返回新点
     */
    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y)
    }

    /**
     * 返回两个点是否相等
     * @param other 另一个点
     * @returns 返回两个点是否相等
     */
    equal_to(other: Point): boolean {
        return this.x == other.x && this.y == other.y
    }
}