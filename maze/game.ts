import { MazeMap } from "./mazemap";
import { Point } from "./point";
import { Random } from "./random";
import { Player } from "./player";
import { MapValue } from "./mapvalue";
import { MoveStatus } from "./movestatus";
import { MapIndexError } from "./exceptions";

export class Game {
  map: MazeMap;
  player: Player;
  is_move: boolean;

  constructor(row: number, column: number, random?: Random) {
    this.map = new MazeMap(row, column, random);
    this.player = new Player(this.map.st);
    this.is_move = false;
  }

  restart() {
    this.player = new Player(this.map.st);
    this.is_move = false;
  }

  row() {
    return this.map.row;
  }

  column() {
    return this.map.column;
  }

  random() {
    return this.map.random;
  }

  /**
   * 判断该点附近是否有路可走
   * @param p 这个点
   * @param lp 上一个点
   * @returns 有路可走，返回下一个点坐标，否则返回null
   */
  _move_find_road(p: Point, lp: Point): Point | null {
    let res: Point | null = null;
    for (const _p of p.get_range()) {
      if (this.map.is_overrange(_p)) continue;
      if (_p.equal_to(lp)) continue;
      if (this.map.getitem(_p) == MapValue.wall) continue;
      if (res != null) return null;
      res = _p;
    }
    return res;
  }

  /**
   * 移动
   * @param move 移动方向
   * @returns 是否移动成功
   */
  move(move: MoveStatus) {
    if (this.is_win()) return false;
    let lp = this.player.pos;
    let p = move.get_next(lp);

    if (this.map.is_overrange(p)) return false;
    if (this.map.getitem(p) == MapValue.wall) return false;

    const move_list = [lp, p];
    let next_road = this._move_find_road(p, lp);
    while (next_road != null && !p.equal_to(this.map.ed)) {
      lp = p;
      p = next_road;
      move_list.push(p);
      next_road = this._move_find_road(p, lp);
    }

    this.player.pos = move_list[move_list.length - 1];
    this.is_move = true;
    this.player.step += move_list.length - 1;
    this.player.move_times++;
    return true;
  }

  move_player(pos: Point) {
    if (this.map.is_overrange(pos)) {
      throw new MapIndexError(`point ${pos} is outside the map`);
    }
    const temp: MapValue[] = [MapValue.road, MapValue.st, MapValue.ed];
    if (temp.indexOf(this.map.getitem(pos)) == -1) return false;

    this.player.pos = pos;
    return true;
  }

  solve(pos?: Point): Point[] {
    if (pos === undefined) {
      pos = this.player.pos;
    }
    return this.map.solve(pos);
  }

  is_win(): boolean {
    return this.map.ed.equal_to(this.player.pos);
  }
}
