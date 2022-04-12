import { GameCards } from "./GameCards.js";
const deck = document.querySelector('.draw-deck');
const discardDeck = document.querySelector('.discard-deck');
const hand1 = document.querySelector('.hand-1');
const hand2 = document.querySelector('.hand-2');
const hand3 = document.querySelector('.hand-3');
const hand4 = document.querySelector('.hand-4');
const cards = new GameCards();
const initGame = () => {
    const frag = document.createDocumentFragment();
    cards.forEachCard((e) => {
        frag.appendChild(e);
    });
    deck.appendChild(frag);
};
export { deck, discardDeck, hand1, hand2, hand3, hand4, cards, initGame };
//# sourceMappingURL=initGame.js.map