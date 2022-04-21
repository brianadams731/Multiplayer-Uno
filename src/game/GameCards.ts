interface ICards {
    [id: string]: HTMLDivElement;
}

enum CardState {
    playerHand = 'playerHand',
    discardPile = 'discardPile',
    topOfDiscardPile = 'topOfDiscardPile',
    drawCardPile = 'drawCardPile',
}

class GameCards {
    private cards: ICards;
    private playersHand: string[];
    private topOfDiscard: string;

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
                const id = (e.target as HTMLDivElement).getAttribute(
                    'data-cardId'
                )!;
                if(this.getCardState(id) === CardState.drawCardPile){
                    this.addCardToPlayersHand(id);
                    this.setCardState(id, CardState.playerHand);
                }else if (this.getCardState(id) === CardState.playerHand) {
                    this.removeCardFromPlayersHand(id);
                    this.setCardState(id, CardState.discardPile);
                }
            });
        }

        this.appendAllCardsToDOM();

        this.forEachCard((_, id) => {
            if (id === '1' || id === '2' || id === '3') {
                this.addCardToPlayersHand(id);
                this.setCardState(id, CardState.playerHand);
            }
        });
    }

    public getCard(id: string) {
        return this.cards[id];
    }

    public forEachCard(
        callback: (card: HTMLDivElement, cardId: string) => void
    ) {
        for (const [key, value] of Object.entries(this.cards)) {
            callback(value, key);
        }
    }

    public forEachCardInPlayersHand(
        callback: (card: HTMLDivElement, index: number) => void
    ) {
        this.playersHand.forEach((currentCardId, currentIndex) => {
            callback(this.getCard(currentCardId), currentIndex);
        });
    }

    public moveCard(
        cardId: string,
        destination: Exclude<CardState, CardState.topOfDiscardPile>
    ) {
        let internalDestination: CardState = destination;
        const currentState = this.getCardState(cardId);
        // If any state needs updating depending on the target, do this here
        // REMOVING
        if (currentState === CardState.playerHand) {
            this.removeCardFromPlayersHand(cardId);
        }

        // ADDING
        if (destination === CardState.playerHand) {
            this.addCardToPlayersHand(cardId);
        } else if (destination === CardState.discardPile) {
            this.shiftTopOfDiscardPile(cardId);
            internalDestination = CardState.topOfDiscardPile;
        }

        this.setCardState(cardId, internalDestination);
    }

    private addCardToPlayersHand(cardId: string) {
        this.playersHand.push(cardId);
        this.cards.playersHand;
        this.recalculatePlayersHandTransform();
    }

    private removeCardFromPlayersHand(cardId: string) {
        this.getCard(cardId).style.transform = 'translateX(0)';
        const indexToRemove = this.playersHand.findIndex(
            (card) => card === cardId
        );

        this.playersHand.splice(indexToRemove, 1);
        this.recalculatePlayersHandTransform();
    }

    private recalculatePlayersHandTransform() {
        const midIndex = this.playersHand.length / 2;
        this.forEachCardInPlayersHand((card, index) => {
            const distFromMid = index - midIndex;
            card.style.transform = `translateX(${distFromMid * 100 + 50}%)`;
        });
    }

    private shiftTopOfDiscardPile(cardId: string) {
        this.setCardState(this.topOfDiscard, CardState.discardPile);
        this.topOfDiscard = cardId;
    }

    private setCardState(cardId: string, state: CardState) {
        const card = this.getCard(cardId);
        card.setAttribute('data-card-state', state);
    }

    private getCardState(cardId: string) {
        return this.getCard(cardId).getAttribute('data-card-state');
    }

    private appendAllCardsToDOM() {
        const domFragment = document.createDocumentFragment();
        this.forEachCard((card) => {
            domFragment.appendChild(card);
        });
        document.querySelector('#game-board')?.appendChild(domFragment);
    }
}

export { GameCards };
