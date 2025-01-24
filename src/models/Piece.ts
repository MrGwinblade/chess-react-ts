import { makeObservable, observable, action } from "mobx"

export interface IPiece {
  enPassantVulnerable: boolean
  x: number
  y: number
  color: "white" | "black"
  isAlive: boolean
  moveCount: number // Добавляем счетчик ходов
  move(newX: number, newY: number): void
  getPossibleMoves(board: (IPiece | null)[][]): [number, number][]
}

export abstract class BasePiece implements IPiece {
  enPassantVulnerable = false
  moveCount = 0 // Инициализируем счетчик
  constructor(
    public x: number,
    public y: number,
    public color: "white" | "black",
  ) {
    makeObservable(this, {
      x: observable,
      y: observable,
      isAlive: observable,
      moveCount: observable,
      enPassantVulnerable: observable,
      move: action,
    })
  }

  isAlive = true

  move(newX: number, newY: number) {
    this.x = newX
    this.y = newY
  }

  abstract getPossibleMoves(board: (IPiece | null)[][]): [number, number][];
}
