import { Point } from './point'
import { Random } from './random'
import { MapValue } from './mapvalue'
import { Queue } from './queue'
import {
    SolveException,
    QueueEmptyException,
    MapInitException,
} from './exceptions'

export class MazeMap implements Iterable<MapValue[]> {
    /**随机数引擎 */
    random: Random
    /**地图 */
    map: MapValue[][]
    /**初始化地图时选取的起始点 */
    inst_st: Point
    /**地图起点 */
    st: Point
    /**地图终点 */
    ed: Point
    /**地图高 */
    row: number
    /**地图宽 */
    column: number

    private iter_idx = 0

    /**
     * 判断某个点是否越界
     * @param p 点
     * @returns 返回是否越界
     */
    is_overrange(p: Point): boolean {
        if (p.x < 0 || p.y < 0) return true
        if (p.x >= this.row || p.y >= this.column) return true
        return false
    }

    /**
     * 返回所有合法的点
     * @param p 这个点
     * @param lp 上一个点
     * @returns 返回所有合法的点
     */
    _init_get_walls(p: Point, lp: Point): Point[] {
        let res_temp = p.get_range()
        let res: Point[] = []
        for (let point of res_temp) {
            if (this.is_overrange(point)) continue
            if (point.equal_to(lp)) continue
            res.push(point)
        }
        return res
    }

    /**
     * 检查这个墙是否能生成道路
     * @param p 这个点
     * @param lp 上一个点
     * @returns 能生成返回true
     */
    _init_check_wall(p: Point, lp: Point): boolean {
        let temp = this._init_get_walls(p, lp)
        if (!temp) return false
        for (let t of temp) {
            if (this.getitem(t) != MapValue.wall)
                return false
        }
        return true
    }

    _init_map() {
        /**初始化地图时所用的初始点 */
        let inst_st = this.inst_st = new Point(this.random.randint(0, this.row - 1), this.random.randint(0, this.column - 1))
        let stack: [Point, Point, number][] = []
        let p = inst_st
        let lp = new Point(-1, -1)
        let step = 0
        stack.push([p, lp, step])
        while (stack.length > 0) {
            let pop_item = stack.pop()
            if (pop_item === undefined) {
                throw RangeError("stack is empty")
            }
            [p, lp, step] = pop_item
            if (!this._init_check_wall(p, lp)) continue
            this.setitem(p, MapValue.road)
            let around_walls = this._init_get_walls(p, lp)
            if (around_walls.length == 0) continue
            this.random.shuffle(around_walls)
            for (let wall of around_walls) {
                stack.push([wall, p, step + 1])
            }
        }

        /**是否获取了 st 和 ed */
        let st_get = false
        let ed_get = false
        for (let i = 0; i < this.row; ++i) {
            for (let j = 0; j < this.column; ++j) {
                if (st_get && ed_get) return
                if (!st_get && this.getitem(i, j) == MapValue.road) {
                    this.st = new Point(i, j)
                    this.setitem(this.st, MapValue.st)
                    st_get = true
                }
                let ed_idx = new Point(this.row - 1 - i, this.column - 1 - j)
                if (!ed_get && this.getitem(ed_idx) == MapValue.road) {
                    this.ed = ed_idx
                    this.setitem(this.ed, MapValue.ed)
                    ed_get = true
                }
            }
        }
        if (!st_get) throw new MapInitException("st not found")
        if (!ed_get) throw new MapInitException("ed not found")
    }

    /**
     * 实例化地图对象
     * @param row 地图宽
     * @param column 地图长
     * @param random 随机数
     */
    constructor(row: number, column: number, random?: Random) {
        if (row < 2 || column < 2) {
            throw new MapInitException("row and column must be greater than 2")
        }
        if (random === undefined) this.random = new Random()
        else this.random = random
        this.row = row
        this.column = column
        this.map = Array(row).fill(column).map((i, _) => Array(column).fill(MapValue.wall))
        this.inst_st = Point.zero
        this.st = Point.zero
        this.ed = Point.zero
        this._init_map()
    }

    /**
     * 获取一个点周围所有没被遍历过的路
     * @param map_temp 记录是否遍历过的地图
     * @param p 这个点
     * @returns 所有周围的路
     */
    _solve_get_roads(map_temp: (Point | null)[][], p: Point): Point[] {
        let res_temp = p.get_range()
        let res: Point[] = []

        for (let _p of res_temp) {
            if (this.is_overrange(_p)) continue
            let idx = map_temp[_p.x][_p.y]
            if (idx != null) continue
            if (this.getitem(_p) == MapValue.wall) continue
            res.push(_p)
        }

        return res
    }

    solve(pos?: Point): Point[] {
        if (pos === undefined) pos = this.st
        if (this.row <= 1 || this.column <= 1) return []
        let queue = new Queue<[Point, Point | null, number]>(this.row * this.column)
        /**
         * 
         * map_temp 用于记录遍历到某个点时的上一个点是什么
         * 如果没有遍历过，则是 null
         *  
         * 例如：
         * map_temp[1, 2] = Point(0, 2)
         * 则 (1, 2) 的前一个点是 (0, 2)
         */
        let map_temp: (Point | null)[][] = Array(this.row).fill(this.column).map((i, _) => Array(this.column).fill(null))
        let p = pos
        let lp: Point | null = null
        let step = 0
        queue.add([p, lp, step])
        while (!p.equal_to(this.ed)) {
            let _temp = queue.leave()
            if (_temp === undefined) {
                throw new QueueEmptyException('queue is empty')
            }
            [p, lp, step] = _temp
            map_temp[p.x][p.y] = lp
            let roads = this._solve_get_roads(map_temp, p)
            for (let road of roads) {
                queue.add([road, p, step + 1])
            }
        }

        let rp = map_temp[this.ed.x][this.ed.y]
        let res: Point[] = Array(step + 1).fill(Point.zero)
        res[step] = this.ed
        for (let i = step - 1; i >= 0; --i) {
            if (rp == null) {
                throw new SolveException('solve a null point')
            }
            res[i] = rp
            rp = map_temp[rp.x][rp.y]
        }
        if (!res[0].equal_to(pos)) {
            throw new SolveException(`solve list is not start from pos: ${pos}`)
        }

        return res
    }

    getitem(x: number, y: number): MapValue;
    getitem(p: Point): MapValue;
    getitem(...args: [number, number] | [Point]) {
        if (args.length == 1) {
            let p: Point = args[0]
            return this.map[p.x][p.y]
        }
        else {
            let [x, y]: [number, number] = args
            return this.map[x][y]
        }
    }

    setitem(x: number, y: number, value: MapValue): void;
    setitem(p: Point, value: MapValue): void;
    setitem(...args: [number, number, MapValue] | [Point, MapValue]) {
        if (args.length == 2) {
            let [p, value]: [Point, MapValue] = args
            this.map[p.x][p.y] = value
        }
        else {
            let [x, y, value]: [number, number, MapValue] = args
            this.map[x][y] = value
        }
    }

    [Symbol.iterator](): Iterator<MapValue[]> {
        return this.map[Symbol.iterator]()
    }

    toString(): string {
        let result: string = ""
        for (let row of this.map) {
            for (let data of row) {
                result += data
            }
            result += '\n'
        }
        return result
    }
}
