import React from 'react';
import { connect } from 'react-redux';


function NextPiece({ gameStart, nextPiece }) {
	const renderNextPiece = () => {
		const boardw = Array.from({ length: 4 }, () => Array(4).fill(0));
	
		try {
		  if (nextPiece.shape && Array.isArray(nextPiece.shape) && nextPiece.shape.length > 0) {
			const offsetX = Math.floor((boardw[0].length - nextPiece.shape[0].length) / 2);
			const offsetY = Math.floor((boardw.length - nextPiece.shape.length) / 2);
	
			nextPiece.shape.forEach((row, rowIndex) => {
			  row.forEach((value, colIndex) => {
				if (value !== 0) {
				  boardw[rowIndex + offsetY][colIndex + offsetX] = value;
				}
			  });
			});
		  }
		} catch (error) {
		//   console.log('Erreur lors du rendu de la pièce suivante :', error);
		}
	
		return boardw.map((row, y) => (
		  <div key={`row-${y}`} className="next-piece-row">
			{row.map((cell, x) => (
				<div
					key={`cell-${y}-${x}`}
					className={`next-piece-cell ${cell !== 0 ? 'filled' : ''}`}
					data-testid={`next-cell-${y}-${x}`}
				></div>
			))}
		  </div>
		));
	  };

	return (
		<div className="next-piece">
		{gameStart && renderNextPiece()}
		</div>
	);
}

const mapStateToProps = (state) => ({
    nextPiece: state.nextPiece,
    gameStart: state.gameStart
});

export default connect(mapStateToProps)(NextPiece);