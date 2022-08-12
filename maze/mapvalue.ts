/**
 * 地图元素
 */
export class MapValue {
  /** 我也不太清楚 */
  static empty = new MapValue("?");
  /** 墙 */
  static wall = new MapValue("O");
  /** 路 */
  static road = new MapValue(" ");
  /** 边界 */
  static border = new MapValue("X");
  /** 起点 */
  static st = new MapValue("S");
  /** 终点 */
  static ed = new MapValue("E");

  value: any;

  constructor(value: any) {
    this.value = value;
  }

  equals_to(other: any) {
    return other instanceof MapValue && this.value === other.value;
  }
}
