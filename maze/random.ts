/**
 * 随机数类
 */
export class Random {
  /**初始时的随机数种子（暂时没用） */
  raw_seed: number;

  /**
   * 构造一个随机数类
   * @param seed 随机数种子（暂时没用）
   */
  constructor(seed = 0) {
    this.raw_seed = seed;
  }

  /**
   * 返回[min, max]之间的一个随机数
   * @param min 最小值（包含）
   * @param max 最大值（包含）
   * @returns 生成的随机数
   */
  randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生成一个包含[0, n - 1]的随机数组
   * @param n 数
   * @returns 生成的数组
   */
  randindex(n: number): Array<number> {
    if (n < 0) {
      throw new RangeError("长度不能小于0");
    }
    const res = Array(n)
      .fill(1)
      .map((_, i) => i);
    for (let i = 0; i < n; ++i) {
      const temp_idx = this.randint(i, n - 1);
      const temp = res[i];
      res[i] = res[temp_idx];
      res[temp_idx] = temp;
    }
    return res;
  }

  /**
   * 打乱数组排序
   * @param array 数组
   */
  shuffle(array: unknown[]): void {
    for (let i = 0; i < array.length; ++i) {
      const temp = this.randint(i, array.length - 1);
      const t = array[i];
      array[i] = array[temp];
      array[temp] = t;
      // array[i], array[temp] = array[temp], array[i]  // 并不能起到数组交换的作用
    }
  }
}
