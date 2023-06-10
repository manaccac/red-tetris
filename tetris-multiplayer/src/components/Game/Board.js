import React from 'react';

function calculateScore(completedLines) {
	if (completedLines === 1) {
	  return 100;
	} else if (completedLines === 2) {
	  return 400;
	} else if (completedLines === 3) {
	  return 800;
	} else if (completedLines === 4) {
	  return 1600;
	}
	return 0;
  }

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		gameOver: false,

      // Créez une matrice 2D vide avec 20 lignes et 10 colonnes
      board: Array.from({ length: 20 }, () => Array(10).fill(0)),
      // Ajouter une matrice 2D pour la pièce active
      piece: {
        shape: [
          [1, 1],
          [1, 1]
        ],
        position: { x: 4, y: 0 },  // position initiale en haut à gauche
      },
	  score: 0,
    };
      // Bind des méthodes pour assurer le bon contexte
	  this.handleKeyDown = this.handleKeyDown.bind(this);
	  this.moveLeft = this.moveLeft.bind(this);
	  this.moveRight = this.moveRight.bind(this);
	  this.rotatePiece = this.rotatePiece.bind(this);
	  this.moveDown = this.moveDown.bind(this);
	  this.movePieceToBottom = this.movePieceToBottom.bind(this);
	}
  
	componentDidMount() {
	  this.timerID = setInterval(() => this.tick(), 500);
	  document.addEventListener("keydown", this.handleKeyDown);
	}
  
	componentWillUnmount() {
	  clearInterval(this.timerID);
	  document.removeEventListener("keydown", this.handleKeyDown);
	}
  
	handleKeyDown(event) {
		if (this.state.gameOver) {
			return;
		  }
	  switch (event.key) {
		case "ArrowLeft":
		  this.moveLeft();
		  break;
		case "ArrowRight":
		  this.moveRight();
		  break;
		case "ArrowUp":
		  this.rotatePiece();
		  break;
		case "ArrowDown":
		  this.moveDown();
		  break;
		case " ":
		  this.movePieceToBottom();
		  break;
		default:
		  break;
	  }
	}
  
	moveLeft() {
		this.setState((state) => {
		  const piece = { ...state.piece };
		  const newPosition = { ...piece.position };
		  newPosition.x -= 1;
		  if (!this.isCollision(piece, newPosition.x, newPosition.y)) {
			piece.position = newPosition;
		  }
		  return { piece: piece };
		});
	  }
	  
	  moveRight() {
		this.setState((state) => {
		  const piece = { ...state.piece };
		  const newPosition = { ...piece.position };
		  newPosition.x += 1;
		  if (!this.isCollision(piece, newPosition.x, newPosition.y)) {
			piece.position = newPosition;
		  }
		  return { piece: piece };
		});
	  }
	  
  
	  rotatePiece() {
		this.setState((state) => {
		  const piece = { ...state.piece };
		  const rotatedShape = this.rotateMatrix(piece.shape);
		  const newPosition = { ...piece.position };
		  piece.shape = rotatedShape;
	  
		  // Vérifier les collisions avec les murs après la rotation
		  if (this.isCollision(piece, newPosition.x, newPosition.y)) {
			// Si une collision est détectée, annuler la rotation
			piece.shape = state.piece.shape;
		  }
	  
		  return { piece: piece };
		});
	  }
	  
	  
	  moveDown() {
		if (this.state.gameOver) {
			return;
		  }
		this.setState((state) => {
		  const piece = { ...state.piece };
		  const newPosition = { ...piece.position };
		  newPosition.y += 1;
	  
		  // Vérifier les collisions avec les autres pièces après le déplacement vers le bas
		  if (this.isCollision(piece, newPosition.x, newPosition.y)) {
			// Si une collision est détectée, la pièce a atteint le bas ou a collisionné avec une autre pièce
			// Mettre à jour le plateau avec la pièce actuelle
			const updatedBoard = [...state.board];
			piece.shape.forEach((row, y) => {
			  row.forEach((cell, x) => {
				if (cell !== 0) {
				  const boardX = piece.position.x + x;
				  const boardY = piece.position.y + y;
				  updatedBoard[boardY][boardX] = cell;
				}
			  });
			});


			      // Vérifier les lignes complètes
				  const completedLines = [];
				  updatedBoard.forEach((row, y) => {
					if (row.every((cell) => cell !== 0)) {
					  completedLines.push(y);
					}
				  });
			
				  // Supprimer les lignes complètes et ajouter de nouvelles lignes vides en haut
				  if (completedLines.length > 0) {
					const newBoard = completedLines.reduce((acc, lineIndex) => {
					  acc.splice(lineIndex, 1);
					  acc.unshift(Array(10).fill(0));
					  return acc;
					}, updatedBoard);
					const score = state.score + calculateScore(completedLines.length);
					return {
					  board: newBoard,
					  piece: this.generateNewPiece(),
					  score: score,
					};
				  }
			
	  
			// Générer une nouvelle pièce
			const newPiece = this.generateNewPiece();
	  
			return {
			  board: updatedBoard,
			  piece: newPiece
			};
		  }
	  
		  // La pièce peut continuer à descendre
		  piece.position = newPosition;
	  
		  return { piece: piece };
		});
	  }
	  
	  
	  movePieceToBottom() {
		this.setState((state) => {
		  const piece = { ...state.piece };
		  const newPosition = { ...piece.position };
		  while (!this.isCollision(piece, newPosition.x, newPosition.y + 1)) {
			newPosition.y += 1;
		  }
		  piece.position = newPosition;
		  return { piece: piece };
		});
	  }
	  
	  rotateMatrix(matrix) {
		const rows = matrix.length;
		const columns = matrix[0].length;
		const rotatedMatrix = [];
		for (let i = 0; i < columns; i++) {
		  rotatedMatrix[i] = Array(rows);
		  for (let j = 0; j < rows; j++) {
			rotatedMatrix[i][j] = matrix[rows - j - 1][i];
		  }
		}
		return rotatedMatrix;
	  }
	  
	  isCollision(piece, x, y) {
		const { board } = this.state;
		const shape = piece.shape;
		const shapeHeight = shape.length;
		const shapeWidth = shape[0].length;
	  
		for (let row = 0; row < shapeHeight; row++) {
		  for (let col = 0; col < shapeWidth; col++) {
			if (
			  shape[row][col] !== 0 &&
			  (y + row >= board.length ||
				x + col < 0 ||
				x + col >= board[0].length ||
				board[y + row][x + col] !== 0)
			) {
			  return true;
			}
		  }
		}
	  
		return false;
	  }

	  
	  

	  tick() {
		if (this.state.gameOver) {
		  return;
		}
		console.log("tick");
		this.setState((state) => {
		  // Mettre à jour la position de la pièce active
		  const piece = { ...state.piece };
		  const newPosition = { ...piece.position };
		  newPosition.y += 1;
	  
		  const bottomCollision = piece.shape.some((row, rowIndex) =>
			row.some((cell, columnIndex) => {
				if (cell === 0) {
				// Cette cellule de la pièce est vide, donc elle ne peut pas causer de collision.
				return false;
				}
				const boardX = newPosition.x + columnIndex;
				const boardY = newPosition.y + rowIndex;
				// Vérifie si la cellule de la pièce est hors du plateau ou si elle est sur une cellule déjà occupée.
				return boardY >= state.board.length || state.board[boardY][boardX] !== 0;
			})
			);

	  
		  // Vérifier les collisions avec d'autres pièces
		  const pieceCollision = piece.shape.some((row, y) =>
			row.some((cell, x) => {
			  if (cell === 0) return false;
			  const boardX = newPosition.x + x;
			  const boardY = newPosition.y + y;
			  return (
				boardY >= 0 &&
				(boardY >= state.board.length || state.board[boardY][boardX] !== 0)
			  );
			})
		  );
	  
		  if (bottomCollision || pieceCollision) {
			// La pièce a atteint le bas ou a collisionné avec une autre pièce
			const updatedBoard = [...state.board];
			piece.shape.forEach((row, y) => {
			  row.forEach((cell, x) => {
				if (cell !== 0) {
				  const boardX = piece.position.x + x;
				  const boardY = piece.position.y + y;
				  updatedBoard[boardY][boardX] = cell;
				}
			  });
			});
	  
			const completedLines = [];
			updatedBoard.forEach((row, y) => {
			  if (row.every((cell) => cell !== 0)) {
				completedLines.push(y);
			  }
			});
	  
			if (completedLines.length > 0) {
			  const newBoard = completedLines.reduce((acc, lineIndex) => {
				acc.splice(lineIndex, 1);
				acc.unshift(Array(10).fill(0));
				return acc;
			  }, updatedBoard);
	  
			  const score = state.score + calculateScore(completedLines.length);

			  return {
				board: newBoard,
				piece: this.generateNewPiece(),
				score: score,
			  };
			}
	  
			return {
			  board: updatedBoard,
			  piece: this.generateNewPiece(),
			};
		  }
	  
		  piece.position = newPosition;
	  
		  return { piece: piece };
		});
	  }
	  
	  
  
  generateNewPiece() {
	if (this.state.gameOver) return null;

	
	// Liste des différentes formes de pièces possibles
	const pieceShapes = [
	  [[1, 1], [1, 1]],   // Carré
	  [[1, 1, 1, 1]],     // Ligne
	  [[1, 1, 1], [0, 1, 0]],  // T
	  [[0, 1, 1], [1, 1, 0]],  // S
	  [[1, 1, 0], [0, 1, 1]],  // Z
	  [[0, 1, 0],[0, 1, 0], [1, 1, 0]],  // L inverse
	  [[0, 1, 0],[0, 1, 0], [0, 1, 1]],  // L


	  // Ajoutez d'autres formes de pièces selon vos règles du jeu
	];
  
	// Génération aléatoire d'un index pour sélectionner une forme de pièce
	const randomIndex = Math.floor(Math.random() * pieceShapes.length);
	const shape = pieceShapes[randomIndex];
  
	// Position initiale en haut du plateau
	const position = { x: 4, y: 0 };
  
	// Créez un nouvel objet représentant la nouvelle pièce
	const newPiece = {
	  shape: shape,
	  position: position
	};

	// Check for collision of new piece at top
  // Check for collision of new piece at top
  if (this.isCollision(newPiece, position.x, position.y)) {
    console.log('Game Over. Restarting...');
    this.setState({
      board: Array.from({ length: 20 }, () => Array(10).fill(0)),
	  gameOver: true, 
    });
    // Game Over, return a simple piece (or null) here
  }

  
	return newPiece;
  }
  
  goHome() {
	window.location.href = '/';
  }
  
  

  render() {
	if (this.state.gameOver) {
		return (
		  <div className="board">
			{this.state.board.map((row, y) =>
			  row.map((cell, x) => (
				<div key={`${y}-${x}`} className={`cell ${cell !== 0 ? 'filled' : ''}`}></div>
			  ))
			)}
			<div className="game-over-screen">
			  <h1>Game Over</h1>
			  <button onClick={this.goHome}>Home</button>
			</div>
		  </div>
		);
	  }
    return (
      <div className="board">
        {this.state.board.map((row, y) =>
          row.map((cell, x) => {
            // Vérifiez si la pièce active est sur cette cellule
            const active = this.state.piece.position.y <= y && y < this.state.piece.position.y + this.state.piece.shape.length
              && this.state.piece.position.x <= x && x < this.state.piece.position.x + this.state.piece.shape[0].length
              && this.state.piece.shape[y - this.state.piece.position.y][x - this.state.piece.position.x];

            return (
              <div key={`${y}-${x}`} className={`cell ${cell !== 0 || active ? 'filled' : ''}`}>
				
			  </div>
            );
          })
        )}
      </div>
    );
  }
}

export default Board;
