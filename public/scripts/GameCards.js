var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Endpoints } from "./utils/endpoints.js";
import { postDataAsync } from "./utils/postDataAsync.js";
var CardState;
(function (CardState) {
    CardState["playerHand"] = "playerHand";
    CardState["opponentHand"] = "opponentHand";
    CardState["discardPile"] = "discardPile";
    CardState["topOfDiscardPile"] = "topOfDiscardPile";
    CardState["drawCardPile"] = "drawCardPile";
    CardState["lastCardInDrawPile"] = "lastCardInDrawPile";
})(CardState || (CardState = {}));
class GameCards {
    constructor(gameState) {
        this.gameState = gameState;
        this.cards = {};
        this.playersHand = [];
        this.addCardEvents();
        const placeHolderCardInDrawPile = this.makeCard("-1");
        placeHolderCardInDrawPile.setAttribute('data-card-state', CardState.lastCardInDrawPile);
        this.cards["-1"] = placeHolderCardInDrawPile;
        this.gameState.gameBoard.appendChild(placeHolderCardInDrawPile);
        /*for (let i = 0; i < 52; i++) {
            const cardId = `${i}`;
            this.cards[cardId] = this.makeCard(cardId);
            this.setCardState(cardId, CardState.drawCardPile);
            this.addCardEvents();
            // debug
            this.cards[cardId].addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLDivElement).getAttribute(
                    'data-cardId'
                )!;
                if (this.getCardState(id) === CardState.drawCardPile) {
                    this.moveCard(id, CardState.playerHand);
                    this.setCardFace(id, 'blue-1');
                } else if (this.getCardState(id) === CardState.playerHand) {
                    this.moveCard(id, CardState.discardPile);
                } else if (
                    this.getCardState(id) === CardState.topOfDiscardPile
                ) {
                    this.forFistOfStateFound(
                        CardState.opponentHand,
                        (_, id) => {
                            this.moveCard(id, CardState.discardPile);
                        }
                    );
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
        });*/
    }
    /*private appendAllCardsToDOM() {
        const domFragment = document.createDocumentFragment();
        this.forEachCard((card) => {
            domFragment.prepend(card);
        });
        this.gameState.gameBoard.appendChild(domFragment);
    }*/
    getCard(id) {
        return this.cards[id];
    }
    /*private forEachCard(
        callback: (card: HTMLDivElement, cardId: string) => void
    ): void {
        for (const [key, value] of Object.entries(this.cards)) {
            callback(value, key);
        }
    }

    private forFistOfStateFound(
        stateToFind: CardState,
        callback: (card: HTMLDivElement, index: string) => void
    ): void {
        for (const [key, value] of Object.entries(this.cards)) {
            if (this.getCardState(key) === stateToFind) {
                callback(value, key);
                break;
            }
        }
    }*/
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
        }
        if (!suppressMoveFlag) {
            this.setCardMovingState(cardId, true);
        }
        this.setCardState(cardId, internalDestination);
    }
    /*private setCardFace(cardId: string, cardFaceClass: string): void {
        const card = this.getCard(cardId);
        const cardFace = card.querySelector<HTMLDivElement>('.front')!;
        cardFace.classList.add(cardFaceClass);
    }*/
    addCardToPlayersHand(cardId) {
        this.playersHand.push(cardId);
        this.recalculatePlayersHandTransform();
    }
    removeCardFromPlayersHand(cardId) {
        this.getCard(cardId).style.transform = 'translateX(0)';
        const indexToRemove = this.playersHand.findIndex((card) => card == cardId);
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
    makeCardWithFace(id, face) {
        const element = this.makeCard(id);
        const cardFace = element.querySelector('.front');
        cardFace.classList.add(face);
        return element;
    }
    addCardEvents() {
        this.gameState.gameBoard.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const cardState = (_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getAttribute("data-card-state");
            if (!cardState) {
                return;
            }
            if (cardState === CardState.drawCardPile || cardState === CardState.lastCardInDrawPile) {
                yield postDataAsync(Endpoints.DrawCard, {
                    gameId: this.gameState.gameId
                });
            }
        }));
        this.gameState.gameBoard.addEventListener('transitionstart', (e) => {
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
        this.gameState.gameBoard.addEventListener('transitionend', (e) => {
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
    playPlayerCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Uncomment return when finished with debug
            if (this.gameState.currentTurn != this.gameState.userId) {
                console.log("Not Players Turn");
                return;
            }
            const res = yield postDataAsync("/api/playCard", {
                cardRefId: id,
                gameId: this.gameState.gameId,
                userId: this.gameState.userId
            });
            if (res.ok) {
                this.discardPlayerCard(id);
            }
        });
    }
    initDiscardPile(face) {
        if (!face) {
            return;
        }
        const id = "-2";
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.opponentHand);
        this.cards[id] = card;
        this.gameState.gameBoard.appendChild(card);
        setTimeout(() => {
            this.moveCard(id, CardState.discardPile);
        }, 250);
    }
    discardPlayerCard(id) {
        this.moveCard(id, CardState.discardPile);
    }
    drawPlayerCard(id, face, timeout = true) {
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.drawCardPile);
        this.cards[id] = card;
        card.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            const id = e.currentTarget.getAttribute('data-cardId');
            yield this.playPlayerCard(id);
            console.log(`PLAYER: ${this.gameState.userId}\nCurrent Turn: ${this.gameState.currentTurn}`);
        }));
        this.gameState.gameBoard.appendChild(card);
        setTimeout(() => {
            this.moveCard(id, CardState.playerHand);
        }, timeout ? 500 : 25);
    }
    drawOpponentCard() {
        const card = this.makeCard("-1");
        card.setAttribute('data-card-state', CardState.drawCardPile);
        card.addEventListener('transition-end', (e) => {
            card.remove();
        });
        this.gameState.gameBoard.appendChild(card);
        setTimeout(() => {
            card.setAttribute('data-card-state', CardState.opponentHand);
        }, 500);
    }
    discardOpponentCard(id, face) {
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.opponentHand);
        this.cards[id] = card;
        this.gameState.gameBoard.appendChild(card);
        setTimeout(() => {
            this.moveCard(id, CardState.discardPile);
        }, 0);
    }
    animateInitialHand(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                this.drawPlayerCard(card.ref, card.value);
            }, index * 1250);
            console.log(card);
        });
        cards.forEach((card, index) => {
            setTimeout(() => {
                this.drawOpponentCard();
            }, (index * 1250) + 625);
            console.log(card);
        });
    }
}
export { GameCards };
//# sourceMappingURL=GameCards.js.map