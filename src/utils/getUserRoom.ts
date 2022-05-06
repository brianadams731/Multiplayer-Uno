const getUserRoom = (
    userId: string | number,
    gameId: string | number
): string => {
    return `u${userId}-g${gameId}`;
};

export { getUserRoom };
