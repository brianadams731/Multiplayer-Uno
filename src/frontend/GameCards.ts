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

    private wildColorToggle:HTMLDivElement|null;

    constructor(gameState: IGameState) {
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

    private getCard(id: string): HTMLDivElement {
        return this.cards[id];
    }

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
        this.setCardState(this.topOfDiscard ? this.topOfDiscard : cardId, CardState.discardPile);
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
        element.setAttribute("card-value",face);
        return element;
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
                    this.forFistOfStateFound(CardState.topOfDiscardPile,(card)=>{
                        card.remove();
                    });
                    this.shiftTopOfDiscardPile(id);
                    this.setCardState(id, CardState.topOfDiscardPile);
                }
            }
        });
    }

    private createWildColorToggle(cardId: string):HTMLDivElement{
        const colors = {0:"red", 1:"yellow", 2:"green", 3:"blue"};

        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add("wildColorToggleWrapper");
        outerWrapper.addEventListener('click',(e)=>{
            e.stopPropagation();
            this.removeWildColorToggle();
        })
        
        const wrapper = document.createElement('div');
        outerWrapper.appendChild(wrapper);
        wrapper.classList.add("wildColorToggle");
        wrapper.addEventListener("click", async(e)=>{
            e.stopPropagation();
            const ele = e.target as HTMLElement;
            if(Object.values(colors).includes(ele?.id)){
                console.log(ele);
                
                const res = await postDataAsync("/api/playCard",{
                    cardRefId: cardId,
                    colorChoice: ele.id,
                    gameId: this.gameState.gameId,
                    userId: this.gameState.userId
                });
        
                if(res.ok){
                    this.discardPlayerCard(cardId);
                    this.removeWildColorToggle();
                }
            }
        })

        for (const [_, value] of Object.entries(colors)) {
            const color = document.createElement('div');
            color.classList.add(value);
            color.id = value;
            wrapper.appendChild(color);
        }

        return outerWrapper;
    }

    private showWildColorToggle(cardId: string){
        if(this.wildColorToggle){
            return;
        }
        this.wildColorToggle = this.createWildColorToggle(cardId);
        this.gameState.gameBoard.appendChild(this.wildColorToggle);
    }
    private removeWildColorToggle(){
        if(!this.wildColorToggle){
            return;
        }
        this.wildColorToggle.remove();
        this.wildColorToggle = null;
    }

    private async playPlayerCard(id: string, value:string){
        if(this.gameState.currentTurn != this.gameState.userId){
            console.log("Not Players Turn");
            return
        }

        if(value.includes('wild')){
            this.showWildColorToggle(id);
            return;
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

    public drawPlayerCard(id: string, face: string, timeout = true){
        const card = this.makeCardWithFace(id, face);
        card.setAttribute('data-card-state', CardState.drawCardPile);
        this.cards[id] = card;
        card.addEventListener('click', async (e) => {
            const id = (e.currentTarget as HTMLDivElement).getAttribute('data-cardId')!;
            const value = (e.currentTarget as HTMLDivElement).getAttribute('card-value')!;
            await this.playPlayerCard(id, value);
        });
        
        this.gameState.gameBoard.appendChild(card);
        setTimeout(()=>{
            this.moveCard(id,CardState.playerHand);
        }, timeout?500:25);
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
