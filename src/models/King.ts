import { BasePiece, type IPiece } from "./Piece"
import { Rook } from "./Rook";

export class King extends BasePiece {
  getPossibleMoves(board: (IPiece | null)[][]): [number, number][] {
    const moves: [number, number][] = [];
    
    // Все возможные направления движения (1 клетка)
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1]
    ];
    const directionsRokirovka = [
      [-2, 0], [2, 0]
    ]

    for (const [dx, dy] of directionsRokirovka) {
      this.checkRokirovka(board, moves, dx, dy);
    }

    for (const [dx, dy] of directions) {
      this.checkSingleSquare(board, moves, dx, dy);
    }

    return moves;
  }

  private checkRokirovka(
    board: (IPiece | null)[][],
    moves: [number, number][],
    dx: number,
    dy: number
  ): void {

    const isKingside = dx > 0;
    const rookStartX = isKingside ? 7 : 0; // Ладья на краю доски
    const kingSteps = isKingside ? 2 : -2; // Смещение короля
  
    // Пропускаем если король уже двигался
    if (this.moveCount !== 0) return;
  
    // Ищем ладью
    const rook = board[this.y][rookStartX];
    if (!(rook instanceof Rook) || rook.moveCount !== 0) return;
  
    // Определяем путь проверки
    const start = Math.min(this.x, rookStartX) + 1;
    const end = Math.max(this.x, rookStartX);
    
    // Проверяем свободные клетки между королем и ладьей
    for (let x = start; x < end; x++) {
      if (board[this.y][x] !== null) return;
    }
  
    // Проверяем конечную позицию короля
    const kingTargetX = this.x + kingSteps;
    if (kingTargetX < 0 || kingTargetX > 7) return;
  
    // Добавляем ход если все условия выполнены
    moves.push([kingTargetX, this.y]);
  }

  // Проверяем только одну клетку в направлении
  private checkSingleSquare(
    board: (IPiece | null)[][],
    moves: [number, number][],
    dx: number,
    dy: number
  ): void {
    const newX = this.x + dx;
    const newY = this.y + dy;

    // Проверка границ доски
    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return;

    const targetPiece = board[newY][newX];

    // Проверяем только следующую клетку
    if (!targetPiece) {
      moves.push([newX, newY]);
    } else if (targetPiece.color !== this.color) {
      moves.push([newX, newY]);
    }
    // Свои фигуры блокируют ход - ничего не добавляем
  }
}