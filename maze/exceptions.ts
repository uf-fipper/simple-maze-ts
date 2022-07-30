export class MazeException extends Error { }

export class MapException extends MazeException { }

export class MapInitException extends MapException { }

export class MapIndexError extends MapException { }

export class GameException extends MazeException { }

export class GameMoveException extends GameException { }

export class SolveException extends MazeException { }

export class QueueEmptyException extends MazeException { }

