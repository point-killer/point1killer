function minimax(board, depth, isMaximizing, alpha, beta) {
    const winner = checkWin();
    if (winner === 'O') return 100 - depth; // البوت يفوز
    if (winner === 'X') return depth - 100; // اللاعب يفوز
    if (board.every(cell => cell !== '')) return 0; // تعادل

    if (depth > 4) return 0; // عمق محدود لمنع الإفراط في التفكير

    const positions = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // ترتيب الأولويات

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i of positions) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i of positions) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    const positions = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // ترتيب أفضلية الحركة
    const randomChance = Math.random() < 0.3; // 30% فرصة للعشوائية

    if (randomChance) {
        // حركة عشوائية
        const availableMoves = gameBoard.map((cell, index) => (cell === '' ? index : null)).filter(cell => cell !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    for (let i of positions) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false, -Infinity, Infinity);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}