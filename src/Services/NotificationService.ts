import type { IPiece } from "../models/Piece"

export interface INotificationService {
    notifyTurnCompleted(board: (IPiece | null)[][], currentTurn: "white" | "black"): void;
  }
  
  export class ConsoleNotificationService implements INotificationService {
    notifyTurnCompleted(board: (IPiece | null)[][], currentTurn: "white" | "black") {
      console.log("всё ок, ход игрока закончен");
      console.log("Текущий ход:", currentTurn);
      console.log("Состояние доски:", JSON.stringify(board));
    }
  }