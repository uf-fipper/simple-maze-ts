/**
 * 游戏元素
 */
export class GameValue {
  /**我也不太清楚 */
  static empty = new GameValue("?");
  /**上次移动的路径 */
  static move = new GameValue(".");
  /**求解路径 */
  static solve = new GameValue("+");

  value: any;

  constructor(value: any) {
    this.value = value;
  }

  equals_to(other: any) {
    return other instanceof GameValue && this.value === other.value;
  }
}
