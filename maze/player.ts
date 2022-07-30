import { Point } from './point'

/**
 * 玩家类
 */
export class Player {
    /**玩家当前位置 */
    pos: Point
    /**玩家名字 */
    name: string
    /**移动步数 */
    step: number
    /**移动次数 */
    move_times: number

    /**
     * 构造一个玩家类
     * @param pos 玩家初始位置
     * @param name 玩家名字
     */
    constructor(pos: Point, name: string = '') {
        this.pos = pos
        this.name = name
        this.step = 0
        this.move_times = 0
    }
}