interface ICards {
    [id: string]: HTMLDivElement;
}

enum CardState {
    playerHand = 'playerHand',
    opponentHand = 'opponentHand',
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
            const cardId = `${i}`;
            this.cards[cardId] = this.makeCard(cardId);
            this.setCardState(cardId, CardState.drawCardPile);

            // debug
            this.cards[cardId].addEventListener('click', (e) => {
                console.log(e);

                const id = (e.currentTarget as HTMLDivElement).getAttribute(
                    'data-cardId'
                )!;
                if (this.getCardState(id) === CardState.drawCardPile) {
                    this.moveCard(id, CardState.playerHand);
                } else if (this.getCardState(id) === CardState.playerHand) {
                    this.moveCard(id, CardState.discardPile);
                }else if(this.getCardState(id) === CardState.topOfDiscardPile){
                    this.forFistOfStateFound(CardState.opponentHand,(_, id)=>{
                        this.moveCard(id, CardState.discardPile);
                    })
                }
            });
        }

        this.appendAllCardsToDOM();

        this.forEachCard((_, id) => {
            if (id === '1' || id === '2' || id === '3') {
                this.moveCard(id, CardState.playerHand);
            }
            if (id === '4' || id === '5' || id === '6') {
                this.moveCard(id, CardState.opponentHand);
            }
        });
    }

    public getCard(id: string): HTMLDivElement {
        return this.cards[id];
    }

    public forEachCard(
        callback: (card: HTMLDivElement, cardId: string) => void
    ): void {
        for (const [key, value] of Object.entries(this.cards)) {
            callback(value, key);
        }
    }

    public forFistOfStateFound(stateToFind: CardState, callback: (card: HTMLDivElement, index: string)=>void):void{
        for (const [key, value] of Object.entries(this.cards)) {
            if(this.getCardState(key) === stateToFind){
                callback(value, key);
                break;
            }
        }
    }

    public forEachCardInPlayersHand(
        callback: (card: HTMLDivElement, index: number) => void
    ): void {
        this.playersHand.forEach((currentCardId, currentIndex) => {
            callback(this.getCard(currentCardId), currentIndex);
        });
    }

    public moveCard(
        cardId: string,
        destination: Exclude<CardState, CardState.topOfDiscardPile>
    ): void {
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

    private addCardToPlayersHand(cardId: string): void {
        this.playersHand.push(cardId);
        this.cards.playersHand;
        this.recalculatePlayersHandTransform();
    }

    private removeCardFromPlayersHand(cardId: string): void {
        this.getCard(cardId).style.transform = 'translateX(0)';
        const indexToRemove = this.playersHand.findIndex(
            (card) => card === cardId
        );

        this.playersHand.splice(indexToRemove, 1);
        this.recalculatePlayersHandTransform();
    }

    private recalculatePlayersHandTransform(): void {
        const midIndex = this.playersHand.length / 2;
        this.forEachCardInPlayersHand((card, index) => {
            const distFromMid = index - midIndex;
            card.style.transform = `translateX(${distFromMid * 100 + 50}%)`;
        });
    }

    private shiftTopOfDiscardPile(cardId: string): void {
        this.setCardState(
            this.topOfDiscard ? this.topOfDiscard : cardId,
            CardState.discardPile
        );
        this.topOfDiscard = cardId;
    }

    private setCardState(cardId: string, state: CardState): void {
        const card = this.getCard(cardId);
        card.setAttribute('data-card-state', state);
    }

    private getCardState(cardId: string): string | null {
        return this.getCard(cardId).getAttribute('data-card-state');
    }

    private appendAllCardsToDOM() {
        const domFragment = document.createDocumentFragment();
        this.forEachCard((card) => {
            domFragment.prepend(card);
        });
        document.querySelector('#game-board')?.appendChild(domFragment);
    }

    private makeCard(id: string): HTMLDivElement {
        const element = document.createElement('div');
        element.classList.add('card');
        element.setAttribute('data-cardId', id);

        const cardFront = document.createElement('div');
        const cardBack = document.createElement('div');

        cardFront.classList.add('front');
        cardBack.classList.add('back');

        element.appendChild(cardFront);
        element.appendChild(cardBack);

        return element;
    }
}

export { GameCards };
