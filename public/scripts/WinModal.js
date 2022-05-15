class WinModal {
    constructor(gameState, userNameOfWinner) {
        const lib = document.createElement('script');
        lib.setAttribute('src', 'https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js');
        document.head.appendChild(lib);
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('win-wrapper');
        this.wrapper.classList.add('fadeIn');
        this.wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        gameState.gameBoard.appendChild(this.wrapper);
        const winner = document.createElement('h1');
        winner.innerText = `${userNameOfWinner} has Won!`;
        this.wrapper.appendChild(winner);
        lib.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.classList.add('confetti-canvas');
            this.wrapper.appendChild(canvas);
            const jsConfetti = new JSConfetti({ canvas });
            setInterval(() => {
                jsConfetti.addConfetti();
            }, 2000);
        };
    }
}
export { WinModal };
//# sourceMappingURL=WinModal.js.map