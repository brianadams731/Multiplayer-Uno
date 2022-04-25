var CardState;
(function (CardState) {
    CardState["playerHand"] = "playerHand";
    CardState["opponentHand"] = "opponentHand";
    CardState["discardPile"] = "discardPile";
    CardState["topOfDiscardPile"] = "topOfDiscardPile";
    CardState["drawCardPile"] = "drawCardPile";
})(CardState || (CardState = {}));
class GameCards {
    constructor() {
        this.cards = {};
        this.playersHand = [];
        for (let i = 0; i < 52; i++) {
            const cardId = `${i}`;
            this.cards[cardId] = this.makeCard(cardId);
            this.setCardState(cardId, CardState.drawCardPile);
            this.addCardEvents();
            // debug
            this.cards[cardId].addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-cardId');
                if (this.getCardState(id) === CardState.drawCardPile) {
                    this.moveCard(id, CardState.playerHand);
                    this.setCardFace(id, 'blue-1');
                }
                else if (this.getCardState(id) === CardState.playerHand) {
                    this.moveCard(id, CardState.discardPile);
                }
                else if (this.getCardState(id) === CardState.topOfDiscardPile) {
                    this.forFistOfStateFound(CardState.opponentHand, (_, id) => {
                        this.moveCard(id, CardState.discardPile);
                    });
                }
            });
        }
        this.appendAllCardsToDOM();
        this.forEachCard((_, id) => {
            if (id === '1' || id === '2' || id === '3') {
                this.moveCard(id, CardState.playerHand, true);
            }
            if (id === '4' || id === '5' || id === '6') {
                this.moveCard(id, CardState.opponentHand, true);
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
    forFistOfStateFound(stateToFind, callback) {
        for (const [key, value] of Object.entries(this.cards)) {
            if (this.getCardState(key) === stateToFind) {
                callback(value, key);
                break;
            }
        }
    }
    forEachCardInPlayersHand(callback) {
        this.playersHand.forEach((currentCardId, currentIndex) => {
            callback(this.getCard(currentCardId), currentIndex);
        });
    }
    moveCard(cardId, destination, suppressMoveFlag) {
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
        } /*else if (destination === CardState.discardPile) { // this got moved to transition
            this.shiftTopOfDiscardPile(cardId);
            internalDestination = CardState.topOfDiscardPile;
        }*/
        if (!suppressMoveFlag) {
            this.setCardMovingState(cardId, true);
        }
        this.setCardState(cardId, internalDestination);
    }
    setCardFace(cardId, cardFaceClass) {
        const card = this.getCard(cardId);
        const cardFace = card.querySelector('.front');
        cardFace.classList.add(cardFaceClass);
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
    setCardMovingState(cardId, isMoving) {
        const card = this.getCard(cardId);
        card.setAttribute('data-moving', isMoving ? '1' : '0');
    }
    getCardMovingState(cardId) {
        const card = this.getCard(cardId);
        return card.getAttribute('data-moving') === '1';
    }
    getCardState(cardId) {
        return this.getCard(cardId).getAttribute('data-card-state');
    }
    appendAllCardsToDOM() {
        var _a;
        const domFragment = document.createDocumentFragment();
        this.forEachCard((card) => {
            domFragment.prepend(card);
        });
        (_a = document.querySelector('#game-board')) === null || _a === void 0 ? void 0 : _a.appendChild(domFragment);
    }
    makeCard(id) {
        const element = document.createElement('div');
        element.classList.add('card');
        element.setAttribute('data-cardId', id);
        element.setAttribute('data-moving', '0');
        const cardFront = document.createElement('div');
        const cardBack = document.createElement('div');
        cardFront.classList.add('front');
        cardBack.classList.add('back');
        element.appendChild(cardFront);
        element.appendChild(cardBack);
        return element;
    }
    addCardEvents() {
        const gameBoard = document.querySelector('#game-board');
        gameBoard === null || gameBoard === void 0 ? void 0 : gameBoard.addEventListener('transitionstart', (e) => {
            const id = e.target.getAttribute("data-cardId");
            const isMoving = id ? this.getCardMovingState(id) : false;
            if (isMoving) {
                if (!id) {
                    return;
                }
                const card = this.getCard(id);
                card.style.zIndex = "100";
            }
        });
        gameBoard === null || gameBoard === void 0 ? void 0 : gameBoard.addEventListener('transitionend', (e) => {
            const id = e.target.getAttribute("data-cardId");
            const isMoving = id ? this.getCardMovingState(id) : false;
            if (isMoving) {
                if (!id) {
                    return;
                }
                const card = this.getCard(id);
                card.style.zIndex = "";
                this.setCardMovingState(id, false);
                if (this.getCardState(id) === CardState.discardPile) {
                    this.shiftTopOfDiscardPile(id);
                    this.setCardState(id, CardState.topOfDiscardPile);
                }
            }
        });
    }
}
export { GameCards };
//# sourceMappingURL=GameCards.js.map