import { Point } from "./point";

/**
 * 移动类
 */
export class MoveStatus {
  /**向上移动 */
  static up = new MoveStatus(new Point(-1, 0));
  /**向下移动 */
  static down = new MoveStatus(new Point(1, 0));
  /**向左移动 */
  static left = new MoveStatus(new Point(0, -1));
  /**向右移动 */
  static right = new MoveStatus(new Point(0, 1));

  point: Point;

  constructor(point: Point) {
    this.point = point;
  }

  /**
   * 返回移动后的点
   * @param p 基准点
   * @returns 下一个点
   */
  get_next(p: Point): Point {
    return p.add(this.point);
  }
}
