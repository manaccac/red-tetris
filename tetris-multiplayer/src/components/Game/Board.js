import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { moveLeft, moveRight, rotate, moveDown, dropPiece, generatePiece, resetState } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';

const lastMove = {
  ArrowLeft: 0,
  ArrowRight: 0,
  ArrowUp: 0,
  ArrowDown: 0,
  " ": 0,
};

const delay = 40; // Délai entre chaque déplacement


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
	generatePiece: () => new Promise((resolve) => dispatch(generatePiece(resolve))),
	resetState: () => new Promise((resolve) => dispatch(resetState(resolve))),
  });
  

function Board(props) {
  let navigate = useNavigate(); // utilisez useNavigate ici au lieu de useHistory

  const goHome = () => {
	props.resetState();
    navigate('/'); // utilisez navigate ici au lieu de history.push
  };

  const handleKeyDown = async (event) => {
    try {
      if (props.isGameOver || Date.now() - lastMove[event.key] < delay) {
        return;
      }
      lastMove[event.key] = Date.now();

      switch (event.key) {
        case "ArrowLeft":
          await props.moveLeft();
          break;
        case "ArrowRight":
          await props.moveRight();
          break;
        case "ArrowUp":
          await props.rotate();
          break;
        case "ArrowDown":
          await props.moveDown();
          break;
        case " ":
          await props.dropPiece();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la touche enfoncée :', error);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(async () => {
      try {
        if (!props.isGameOver) {
          await props.moveDown();
        }
      } catch (error) {
        console.error('Erreur lors du déplacement vers le bas automatique :', error);
      }
    }, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
	}, [props.isGameOver]); 

  const renderGameOverScreen = () => (
    <div className="game-over-screen">
      <h1>Game Over</h1>
      <button onClick={goHome}>Home</button>
    </div>
  );

  const renderCells = () =>
    props.board.map((row, y) =>
      row.map((cell, x) => {
        let active = false;
        if (props.piece === undefined || props.piece.position === undefined)
          return (
            <div
              key={`${y}-${x}`}
              className={`cell ${cell !== 0 || active ? 'filled' : ''}`}
            ></div>
          );
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

    try {
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
    } catch (error) {
      console.error('Erreur lors du rendu de la pièce suivante :', error);
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);
