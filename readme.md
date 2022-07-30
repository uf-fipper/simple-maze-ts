# 使用方法
game = Game(10, 20)  // 初始化游戏<br>
move_list: Point[] = game.move(MoveStatus.right)  // 向右移动，每次移动会自动寻找下一个分支点<br>
solve_list: Point[] = game.solve()  // 求解<br>
if (game.is_win()) {...}  // 判断游戏是否结束<br>
game.restart()  // 人物回到起点<br>

player = game.player  // 玩家信息<br>
player.pos  // 当前位置<br>
player.step  // 移动步数<br>
player.move_times  // 移动次数<br>
