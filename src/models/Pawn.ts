import { BasePiece, type IPiece } from "./Piece"

export class Pawn extends BasePiece {
  getPossibleMoves(board: (IPiece | null)[][]): [number, number][] {
    const moves: [number, number][] = []
    const direction = this.color === "white" ? -1 : 1 // Направление движения пешки

    this.enPassantVulnerable = false;


    // Проверка хода вперед на одну клетку
    if (this.isValidMove(board, this.x, this.y + direction)) {
      moves.push([this.x, this.y + direction])

      // Проверка хода вперед на две клетки (только из начальной позиции)
      if ((this.color === "white" && this.moveCount === 0) || (this.color === "black" && this.moveCount === 0)) {
        if (this.isValidMove(board, this.x, this.y + 2 * direction)) {
          moves.push([this.x, this.y + 2 * direction])
        }
      }
    }

    // Проверка диагональных атак
    this.checkDiagonalAttack(board, moves, this.x - 1, this.y + direction)
    this.checkDiagonalAttack(board, moves, this.x + 1, this.y + direction)

    this.checkEnPassant(board, moves);


    return moves
  }

  // Универсальная проверка на корректность движения
  private isValidMove(board: (IPiece | null)[][], x: number, y: number): boolean {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false // Границы доски
    return board[y][x] === null // Проверяем, что клетка пуста
  }

  // Проверка возможности диагональной атаки
  private checkDiagonalAttack(board: (IPiece | null)[][], moves: [number, number][], x: number, y: number): void {
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
      const targetPiece = board[y][x]
      if (targetPiece && targetPiece.color !== this.color) {
        moves.push([x, y])
      }
    }
  }

  private checkEnPassant(board: (IPiece | null)[][], moves: [number, number][]): void {
    const direction = this.color === "white" ? -1 : 1;

    // Соседние позиции (влево и вправо)
    const left = this.x - 1;
    const right = this.x + 1;

    // Проверка клетки влево
    if (left >= 0) {
      const leftPiece = board[this.y]?.[left];
      if (
        leftPiece instanceof Pawn && // Убедимся, что это пешка
        leftPiece.enPassantVulnerable && // Она уязвима для взятия на проходе
        leftPiece.color !== this.color // И она враг
      ) {
        moves.push([left, this.y + direction]); // Добавляем позицию для взятия
      }
    }

    // Проверка клетки вправо
    if (right <= 7) {
      const rightPiece = board[this.y]?.[right];
      if (
        rightPiece instanceof Pawn && // Убедимся, что это пешка
        rightPiece.enPassantVulnerable && // Она уязвима для взятия на проходе
        rightPiece.color !== this.color // И она враг
      ) {
        moves.push([right, this.y + direction]); // Добавляем позицию для взятия
      }
    }
  }

}

