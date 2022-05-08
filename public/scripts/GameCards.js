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
        this.wildColorToggle = null;
        this.gameState = gameState;
        this.cards = {};
        this.playersHand = [];
        this.addCardEvents();
        const placeHolderCardInDrawPile = this.makeCard("-1");
        placeHolderCardInDrawPile.setAttribute('data-card-state', CardState.lastCardInDrawPile);
        this.cards["-1"] = placeHolderCardInDrawPile;
        this.gameState.gameBoard.appendChild(placeHolderCardInDrawPile);
    }
    getCard(id) {
        return this.cards[id];
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
        }
        if (!suppressMoveFlag) {
            this.setCardMovingState(cardId, true);
        }
        this.setCardState(cardId, internalDestination);
    }
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
        const displayWidthCardCount = 8;
        const handSize = this.playersHand.length;
        let midIndex = (this.playersHand.length % displayWidthCardCount) / 2;
        this.forEachCardInPlayersHand((card, index) => {
            // TODO: Refactor this
            const overFlowIndex = displayWidthCardCount / 2;
            if (index < displayWidthCardCount) {
                const distFromMid = index - (handSize < displayWidthCardCount ? midIndex : overFlowIndex);
                card.style.transform = `translateX(${distFromMid * 100 + 50}%)`;
                card.style.zIndex = '1000000';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 2) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 2) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -30%)`;
                card.style.zIndex = '100000';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 3) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 3) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -60%)`;
                card.style.zIndex = '10000';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 4) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 4) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -90%)`;
                card.style.zIndex = '1000';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 5) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 5) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -120%)`;
                card.style.zIndex = '100';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 6) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 6) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -150%)`;
                card.style.zIndex = '10';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 7) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 7) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -180%)`;
                card.style.zIndex = '10';
            }
            else if (index >= displayWidthCardCount && index < displayWidthCardCount * 8) {
                const distFromMid = (index % 8) - (handSize < (displayWidthCardCount * 8) ? midIndex : overFlowIndex);
                card.style.transform = `translate(${distFromMid * 100 + 50}%, -210%)`;
                card.style.zIndex = '10';
            }
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
        element.setAttribute("card-value", face);
        return element;
    }
    forFistOfStateFound(stateToFind, callback) {
        for (const [key, value] of Object.entries(this.cards)) {
            if (this.getCardState(key) === stateToFind) {
                callback(value, key);
                break;
            }
        }
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
                    this.forFistOfStateFound(CardState.topOfDiscardPile, (card) => {
                        card.remove();
                    });
                    this.shiftTopOfDiscardPile(id);
                    this.setCardState(id, CardState.topOfDiscardPile);
                }
            }
        });
    }
    createWildColorToggle(cardId) {
        const colors = { 0: "red", 1: "yellow", 2: "green", 3: "blue" };
        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add("wildColorToggleWrapper", "fadeIn");
        outerWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeWildColorToggle();
        });
        outerWrapper.addEventListener('animationend', (e) => {
            if (e.animationName === "fadeOut") {
                e.target.remove();
                this.wildColorToggle = null;
            }
        });
        const wrapper = document.createElement('div');
        outerWrapper.appendChild(wrapper);
        wrapper.classList.add("wildColorToggle", "rotateIn");
        wrapper.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            const ele = e.target;
            if (Object.values(colors).includes(ele === null || ele === void 0 ? void 0 : ele.id)) {
                console.log(ele);
                const res = yield postDataAsync("/api/playCard", {
                    cardRefId: cardId,
                    colorChoice: ele.id,
                    gameId: this.gameState.gameId,
                    userId: this.gameState.userId
                });
                if (res.ok) {
                    this.discardPlayerCard(cardId);
                    this.removeWildColorToggle();
                }
            }
        }));
        for (const [_, value] of Object.entries(colors)) {
            const color = document.createElement('div');
            color.classList.add(value);
            color.id = value;
            wrapper.appendChild(color);
        }
        return outerWrapper;
    }
    showWildColorToggle(cardId) {
        if (this.wildColorToggle) {
            return;
        }
        this.wildColorToggle = this.createWildColorToggle(cardId);
        this.gameState.gameBoard.appendChild(this.wildColorToggle);
    }
    removeWildColorToggle() {
        if (!this.wildColorToggle) {
            return;
        }
        this.wildColorToggle.classList.remove('fadeIn');
        this.wildColorToggle.classList.add('fadeOut');
        this.wildColorToggle.children[0].classList.remove("rotateIn");
        this.wildColorToggle.children[0].classList.add("rotateOut");
    }
    playPlayerCard(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gameState.currentTurn != this.gameState.userId) {
                console.log("Not Players Turn");
                return;
            }
            if (value.includes('wild')) {
                this.showWildColorToggle(id);
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
            const value = e.currentTarget.getAttribute('card-value');
            yield this.playPlayerCard(id, value);
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