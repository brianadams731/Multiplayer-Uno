var CardState;
(function (CardState) {
    CardState["playerHand"] = "playerHand";
    CardState["discardPile"] = "discardPile";
    CardState["topOfDiscardPile"] = "topOfDiscardPile";
    CardState["drawCardPile"] = "drawCardPile";
})(CardState || (CardState = {}));
class GameCards {
    constructor() {
        this.cards = {};
        this.playersHand = [];
        for (let i = 0; i < 52; i++) {
            const element = document.createElement('div');
            const cardId = `${i}`;
            this.cards[cardId] = element;
            element.classList.add('card');
            element.setAttribute('data-cardId', cardId);
            this.setCardState(cardId, CardState.drawCardPile);
            // debug
            element.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-cardId');
                if (this.getCardState(id) === CardState.drawCardPile) {
                    this.moveCard(id, CardState.playerHand);
                }
                else if (this.getCardState(id) === CardState.playerHand) {
                    this.moveCard(id, CardState.discardPile);
                }
            });
        }
        this.appendAllCardsToDOM();
        this.forEachCard((_, id) => {
            if (id === '1' || id === '2' || id === '3') {
                this.moveCard(id, CardState.playerHand);
            }
        });
    }
    getCard(id) {
        return this.cards[id];
    }
    forEachCard(callback) {
        for (const [key, value] of Object.entries(this.cards)) {
            callback(value, key);
        }
    }
    forEachCardInPlayersHand(callback) {
        this.playersHand.forEach((currentCardId, currentIndex) => {
            callback(this.getCard(currentCardId), currentIndex);
        });
    }
    moveCard(cardId, destination) {
        let internalDestination = destination;
        const currentState = this.getCardState(cardId);
        // If any state needs updating depending on the target, do this here
        // REMOVING
        if (currentState === CardState.playerHand) {
            this.removeCardFromPlayersHand(cardId);
        }
        // ADDING
        if (destination === CardState.playerHand) {
            this.addCardToPlayersHand(cardId);
        }
        else if (destination === CardState.discardPile) {
            this.shiftTopOfDiscardPile(cardId);
            internalDestination = CardState.topOfDiscardPile;
        }
        this.setCardState(cardId, internalDestination);
    }
    addCardToPlayersHand(cardId) {
        this.playersHand.push(cardId);
        this.cards.playersHand;
        this.recalculatePlayersHandTransform();
    }
    removeCardFromPlayersHand(cardId) {
        this.getCard(cardId).style.transform = 'translateX(0)';
        const indexToRemove = this.playersHand.findIndex((card) => card === cardId);
        this.playersHand.splice(indexToRemove, 1);
        this.recalculatePlayersHandTransform();
    }
    recalculatePlayersHandTransform() {
        const midIndex = this.playersHand.length / 2;
        this.forEachCardInPlayersHand((card, index) => {
            const distFromMid = index - midIndex;
            card.style.transform = `translateX(${distFromMid * 100 + 50}%)`;
        });
    }
    shiftTopOfDiscardPile(cardId) {
        this.setCardState(this.topOfDiscard ? this.topOfDiscard : cardId, CardState.discardPile);
        this.topOfDiscard = cardId;
    }
    setCardState(cardId, state) {
        const card = this.getCard(cardId);
        card.setAttribute('data-card-state', state);
    }
    getCardState(cardId) {
        return this.getCard(cardId).getAttribute('data-card-state');
    }
    appendAllCardsToDOM() {
        var _a;
        const domFragment = document.createDocumentFragment();
        this.forEachCard((card) => {
            domFragment.appendChild(card);
        });
        (_a = document.querySelector('#game-board')) === null || _a === void 0 ? void 0 : _a.appendChild(domFragment);
    }
}
export { GameCards };
//# sourceMappingURL=GameCards.js.map