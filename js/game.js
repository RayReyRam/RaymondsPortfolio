// Code Breaker Game Logic
class CodeBreakerGame {
    constructor() {
        this.secretCode = [];
        this.attempts = 10;
        this.maxAttempts = 10;
        this.score = 0;
        this.bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
        this.currentStreak = 0;
        this.gameOver = false;
        
        this.init();
    }

    init() {
        this.generateSecretCode();
        this.setupEventListeners();
        this.updateDisplay();
        this.loadBestStreak();
    }

    generateSecretCode() {
        this.secretCode = [];
        for (let i = 0; i < 4; i++) {
            this.secretCode.push(Math.floor(Math.random() * 10));
        }
        console.log('Secret code generated (dev):', this.secretCode.join(''));
    }

    setupEventListeners() {
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleGuess(parseInt(btn.dataset.number)));
        });

        document.getElementById('newGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('giveUpBtn').addEventListener('click', () => this.revealCode());
    }

    handleGuess(number) {
        if (this.gameOver) return;

        const position = this.secretCode.indexOf(number);
        
        if (position !== -1) {
            // Correct guess
            this.revealDigit(position, number);
            this.disableButton(number, 'correct');
            this.showHint(`✓ ${number} is in the code!`);
            
            if (this.isCodeComplete()) {
                this.winGame();
            }
        } else {
            // Wrong guess
            this.attempts--;
            this.disableButton(number, 'wrong');
            this.showHint(`✗ ${number} is not in the code. ${this.attempts} attempts left.`);
            
            if (this.attempts === 0) {
                this.loseGame();
            }
        }

        this.updateDisplay();
    }

    revealDigit(position, number) {
        const codeDigits = document.querySelectorAll('.code-digit');
        codeDigits[position].textContent = number;
        codeDigits[position].classList.add('revealed');
    }

    isCodeComplete() {
        const revealedDigits = document.querySelectorAll('.code-digit.revealed');
        return revealedDigits.length === 4;
    }

    disableButton(number, className) {
        const button = document.querySelector(`[data-number="${number}"]`);
        button.disabled = true;
        button.classList.add(className);
    }

    winGame() {
        this.gameOver = true;
        const bonusPoints = this.attempts * 10;
        this.score += 100 + bonusPoints;
        this.currentStreak++;
        
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
            localStorage.setItem('bestStreak', this.bestStreak);
        }

        this.showMessage(
            `🎉 Code Cracked! You earned ${100 + bonusPoints} points (${bonusPoints} bonus for ${this.attempts} attempts remaining)`,
            'success'
        );
        this.updateDisplay();
    }

    loseGame() {
        this.gameOver = true;
        this.currentStreak = 0;
        this.revealCode();
        this.showMessage(`😔 Out of attempts! The code was ${this.secretCode.join('')}`, 'failure');
    }

    revealCode() {
        this.gameOver = true;
        const codeDigits = document.querySelectorAll('.code-digit');
        this.secretCode.forEach((digit, index) => {
            codeDigits[index].textContent = digit;
            codeDigits[index].classList.add('revealed');
        });
        
        if (this.attempts > 0) {
            this.currentStreak = 0;
            this.showMessage(`Code revealed: ${this.secretCode.join('')}. Try again!`, 'failure');
        }
    }

    resetGame() {
        // Reset game state
        this.secretCode = [];
        this.attempts = this.maxAttempts;
        this.gameOver = false;
        
        // Reset display
        const codeDigits = document.querySelectorAll('.code-digit');
        codeDigits.forEach(digit => {
            digit.textContent = '?';
            digit.classList.remove('revealed');
        });

        // Reset buttons
        const buttons = document.querySelectorAll('.number-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });

        // Hide message
        document.getElementById('gameMessage').style.display = 'none';
        
        // Reset hint
        this.showHint('Select a number to make your first guess');

        // Generate new code
        this.generateSecretCode();
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('attempts').textContent = this.attempts;
        document.getElementById('score').textContent = this.score;
        document.getElementById('streak').textContent = this.bestStreak;
    }

    loadBestStreak() {
        document.getElementById('streak').textContent = this.bestStreak;
    }

    showHint(message) {
        document.getElementById('hint').textContent = message;
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('gameMessage');
        messageEl.textContent = message;
        messageEl.className = `game-message ${type}`;
        messageEl.style.display = 'block';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeBreakerGame();
});
