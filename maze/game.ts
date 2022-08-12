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
      if (this.map.getitem(_p).equals_to(MapValue.wall)) continue;
      if (res != null) return null;
      res = _p;
    }
    return res;
  }

  /**
   * 移动
   * @param move 移动方向
   * @param afterMove 每次移动一格时会调用该函数 p: 这个格子的点，返回false将不再进行自动寻路
   * @returns 是否移动成功
   */
  move(move: MoveStatus, afterMove?: (p: Point) => boolean): Point[] {
    if (this.is_win()) return [];
    let lp = this.player.pos;
    let p = move.get_next(lp);

    if (this.map.is_overrange(p)) return [];
    if (this.map.getitem(p).equals_to(MapValue.wall)) return [];

    const moveList = [lp, p];
    let next_road = this._move_find_road(p, lp);
    while (next_road != null && !p.equal_to(this.map.ed)) {
      lp = p;
      p = next_road;
      if (afterMove !== undefined && afterMove(p)) break;
      moveList.push(p);
      next_road = this._move_find_road(p, lp);
    }

    this.player.pos = moveList[moveList.length - 1];
    this.is_move = true;
    this.player.step += moveList.length - 1;
    this.player.move_times++;
    return moveList;
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
