import { IGameState } from "./interfaces/IGameState";
import { Endpoints } from "./utils/endpoints.js";
import { postDataAsync } from "./utils/postDataAsync.js";

interface ICards {
    [id: string]: HTMLDivElement;
}

interface ResCard{
    value: string;
    ref: number|string;
}

enum CardState {
    playerHand = 'playerHand',
    opponentHand = 'opponentHand',
    discardPile = 'discardPile',
    topOfDiscardPile = 'topOfDiscardPile',
    drawCardPile = 'drawCardPile',
    lastCardInDrawPile = 'lastCardInDrawPile'
}

class GameCards {
    private gameState: IGameState;
    private cards: ICards;
    private playersHand: string[];
    private topOfDiscard: string;

    constructor(gameState: IGameState) {
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

    private getCard(id: string): HTMLDivElement {
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

    private forEachCardInPlayersHand(
        callback: (card: HTMLDivElement, index: number) => void
    ): void {
        this.playersHand.forEach((currentCardId, currentIndex) => {
            callback(this.getCard(currentCardId), currentIndex);
        });
    }

    private moveCard(
        cardId: string,
        destination: Exclude<CardState, CardState.topOfDiscardPile>,
        suppressMoveFlag?: boolean
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
        }

        if(!suppressMoveFlag){
            this.setCardMovingState(cardId, true);
        }
        this.setCardState(cardId, internalDestination);
    }

    /*private setCardFace(cardId: string, cardFaceClass: string): void {
        const card = this.getCard(cardId);
        const cardFace = card.querySelector<HTMLDivElement>('.front')!;
        cardFace.classList.add(cardFaceClass);
    }*/

    private addCardToPlayersHand(cardId: string): void {
        this.playersHand.push(cardId);
        this.recalculatePlayersHandTransform();
    }

    private removeCardFromPlayersHand(cardId: string): void {
        this.getCard(cardId).style.transform = 'translateX(0)';
        const indexToRemove = this.playersHand.findIndex(
            (card) => card == cardId
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
    private setCardMovingState(cardId: string, isMoving: boolean) {
        const card = this.getCard(cardId);
        card.setAttribute('data-moving', isMoving ? '1' : '0');
    }
    private getCardMovingState(cardId: string) {
        const card = this.getCard(cardId);
        return card.getAttribute('data-moving') === '1';
    }

    private getCardState(cardId: string): string | null {
        return this.getCard(cardId).getAttribute('data-card-state');
    }


    private makeCard(id: string): HTMLDivElement {
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

    private makeCardWithFace(id: string, face: string): HTMLDivElement {
        const element = this.makeCard(id);
        const cardFace = element.querySelector<HTMLDivElement>('.front')!;
        cardFace.classList.add(face);
        return element;
    }

    private addCardEvents() {

        this.gameState.gameBoard.addEventListener('click', async (e: any)=>{
            const cardState = e.target?.parentElement?.getAttribute("data-card-state");
            if(!cardState){
                return;
            }
            if(cardState === CardState.drawCardPile || cardState === CardState.lastCardInDrawPile){
                await postDataAsync(Endpoints.DrawCard,{
                    gameId: this.gameState.gameId
                })
            }            
        })

        this.gameState.gameBoard.addEventListener('transitionstart', (e) => {
            const id = (e.target as HTMLElement).getAttribute("data-cardId");
            const isMoving = id? this.getCardMovingState(id):false;
            if(isMoving){
                if(!id){
                    return;
                }
                const card = this.getCard(id);
                card.style.zIndex = "100";
            }
        });

        this.gameState.gameBoard.addEventListener('transitionend', (e) => {
            const id = (e.target as HTMLElement).getAttribute("data-cardId");
            const isMoving = id?this.getCardMovingState(id):false;
            if(isMoving){
                if(!id){
                    return;
                }
                const card = this.getCard(id);
                card.style.zIndex = "";

                this.setCardMovingState(id, false);
               
                if(this.getCardState(id) === CardState.discardPile){
                    this.shiftTopOfDiscardPile(id);
                    this.setCardState(id, CardState.topOfDiscardPile);
                }
            }
        });
    }

    private async playPlayerCard(id: string){
        // TODO: Uncomment return when finished with debug
        if(this.gameState.currentTurn != this.gameState.userId){
            console.log("Not Players Turn");
            return
        }

        const res = await postDataAsync("/api/playCard",{
            cardRefId: id,
            gameId: this.gameState.gameId,
            userId: this.gameState.userId
        });

        if(res.ok){
            this.discardPlayerCard(id);
        }
    }

    public initDiscardPile(face: string){
        if(!face){
            return;
        }
        const id = "-2"
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.opponentHand);
        this.cards[id] = card;
        this.gameState.gameBoard.appendChild(card);
        setTimeout(()=>{
            this.moveCard(id,CardState.discardPile);
        }, 250);
    }

    public discardPlayerCard(id: string){
        this.moveCard(id, CardState.discardPile);
    }

    public drawPlayerCard(id: string, face: string){
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.drawCardPile);
        this.cards[id] = card;
        card.addEventListener('click', async (e) => {
            const id = (e.currentTarget as HTMLDivElement).getAttribute(
                'data-cardId'
            )!;
            
            await this.playPlayerCard(id);
            console.log(`PLAYER: ${this.gameState.userId}\nCurrent Turn: ${this.gameState.currentTurn}`);
        });
        
        this.gameState.gameBoard.appendChild(card);
        setTimeout(()=>{
            this.moveCard(id,CardState.playerHand);
        }, 500);
    }

    public drawOpponentCard(){
        const card = this.makeCard("-1");
        card.setAttribute('data-card-state', CardState.drawCardPile);
        card.addEventListener('transition-end', (e) => {
            card.remove();
        });
        this.gameState.gameBoard.appendChild(card);
        setTimeout(()=>{
            card.setAttribute('data-card-state', CardState.opponentHand);
        }, 500);
    }

    public discardOpponentCard(id: string, face: string){
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.opponentHand);
        this.cards[id] = card;
        this.gameState.gameBoard.appendChild(card);
        setTimeout(()=>{
            this.moveCard(id,CardState.discardPile);
        }, 0);
    }

    public animateInitialHand(cards: ResCard[]):void{
        cards.forEach((card:any, index:number)=>{
            setTimeout(()=>{
                this.drawPlayerCard(card.ref, card.value);
            }, index * 1250);
            console.log(card);
        })
    
        cards.forEach((card:any, index:number)=>{
            setTimeout(()=>{
                this.drawOpponentCard();
            }, (index * 1250) + 625);
            console.log(card);
        })
    }
}

export { GameCards };
