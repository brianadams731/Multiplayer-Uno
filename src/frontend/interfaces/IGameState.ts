interface IGameState {
    userId: number;
    currentTurn: number;
    readonly gameId: string;
    readonly gameBoard: HTMLDivElement;
}

export type { IGameState };
