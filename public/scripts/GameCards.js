class GameCards {
    constructor() {
        this.cards = {};
        for (let i = 0; i < 52; i++) {
            const element = document.createElement('div');
            element.classList.add('card');
            this.cards[`${i}`] = element;
        }
    }
    forEachCard(callback) {
        for (const [_, value] of Object.entries(this.cards)) {
            callback(value);
        }
    }
    getCard(id) {
        return this.cards[id];
    }
}
export { GameCards };
//# sourceMappingURL=GameCards.js.map