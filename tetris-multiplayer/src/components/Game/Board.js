import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { moveLeft, moveRight, rotate, moveDown, dropPiece, generatePiece } from '../../redux/actions';

function Board(props) {
  const handleKeyDown = async (event) => {
    if (props.isGameOver) {
      return;
    }
	switch (event.key) {
		case "ArrowLeft":
		  await props.moveLeft(); // Attendre la fin du déplacement
		  break;
		case "ArrowRight":
		  await props.moveRight(); // Attendre la fin du déplacement
		  break;
		case "ArrowUp":
		  await props.rotate(); // Attendre la fin du déplacement
		  break;
		case "ArrowDown":
		  await props.moveDown(); // Attendre la fin du déplacement
		  break;
		case " ":
		  await props.dropPiece(); // Attendre la fin du déplacement
		  break;
		default:
		  break;
	  }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!props.isGameOver) {
        await props.moveDown();
      }
    }, 500);

    return () => {
      clearInterval(interval); // stop interval
    };
  }, []);

  const renderGameOverScreen = () => (
    <div className="game-over-screen">
      <h1>Game Over</h1>
      <button onClick={props.goHome}>Home</button>
    </div>
  );

  const renderCells = () =>
	props.board.map((row, y) =>
		row.map((cell, x) => {
		let active = false;
		if (props.piece) {
			active =
			props.piece.position.y <= y &&
			y < props.piece.position.y + props.piece.shape.length &&
			props.piece.position.x <= x &&
			x < props.piece.position.x + props.piece.shape[0].length &&
			props.piece.shape[y - props.piece.position.y][x - props.piece.position.x];
		}

		return (
			<div
			key={`${y}-${x}`}
			className={`cell ${cell !== 0 || active ? 'filled' : ''}`}
			></div>
		);
		})
	);


	const renderNextPiece = () => {
		const boardw = Array.from({ length: 4 }, () => Array(4).fill(0));
	  
		if (props.nextPiece.shape && Array.isArray(props.nextPiece.shape) && props.nextPiece.shape.length > 0) {
		  const offsetX = Math.floor((boardw[0].length - props.nextPiece.shape[0].length) / 2);
		  const offsetY = Math.floor((boardw.length - props.nextPiece.shape.length) / 2);
	  
		  props.nextPiece.shape.forEach((row, rowIndex) => {
			row.forEach((value, colIndex) => {
			  if (value !== 0) {
				boardw[rowIndex + offsetY][colIndex + offsetX] = value;
			  }
			});
		  });
		}


    return boardw.map((row, y) => (
      <div key={`row-${y}`} className="next-piece-row">
        {row.map((cell, x) => (
          <div
            key={`cell-${y}-${x}`}
            className={`next-piece-cell ${cell !== 0 ? 'filled' : ''}`}
          ></div>
        ))}
      </div>
    ));
  };

  return (
    <div
      className="game-container"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div className="board">
        {renderCells()}
      </div>
      <div className="next-piece">
        {renderNextPiece()}
      </div>
      {props.isGameOver && renderGameOverScreen()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  board: state.board,
  piece: state.piece,
  nextPiece: state.nextPiece,
  isGameOver: state.isGameOver,
});

const mapDispatchToProps = (dispatch) => ({
  moveLeft: () => new Promise((resolve) => dispatch(moveLeft(resolve))),
  moveRight: () => new Promise((resolve) => dispatch(moveRight(resolve))),
  rotate: () => new Promise((resolve) => dispatch(rotate(resolve))),
  moveDown: () => new Promise((resolve) => dispatch(moveDown(resolve))),
  dropPiece: () => new Promise((resolve) => dispatch(dropPiece(resolve))),
  generatePiece: () =>  new Promise((resolve) => dispatch(generatePiece(resolve))),
  goHome: () => {
    // Code pour renvoyer à la page d'accueil
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
