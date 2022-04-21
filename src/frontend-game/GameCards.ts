interface ICards {
    [id: string]: HTMLDivElement;
}

class GameCards {
    cards: ICards;
    constructor() {
        this.cards = {};
        for (let i = 0; i < 52; i++) {
            const element = document.createElement('div');
            element.classList.add('card');
            this.cards[`${i}`] = element;
        }
    }

    public forEachCard(callback: (card: HTMLDivElement) => void) {
        for (const [_, value] of Object.entries(this.cards)) {
            callback(value);
        }
    }

    public getCard(id:string){
        return this.cards[id];
    }

}

export { GameCards };
