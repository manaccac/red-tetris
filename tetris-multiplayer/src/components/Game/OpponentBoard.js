import React from 'react';
import { connect } from 'react-redux';

function OpponentBoard({ opponentBoard, opponentName }) {
	
	const renderOpponentBoard = () => {
		if (opponentBoard && Array.isArray(opponentBoard) && opponentBoard.length > 0) {

		  return opponentBoard.flatMap((row, y) =>
			row.map((cell, x) => (
			  <div
				key={`cell-${y}-${x}`}
				className={`opponent-board-cell ${cell !== 0 ? 'filled' : ''}`}
			  ></div>
			))
		  );
		} else {
		  return null;
		}
	};

	// return (
	// 	<div className='ghost-board'>
	// 		<div className="opponent-name">
	// 			{opponentName}
	// 		</div>
	// 		<div className="opponent-board">
	// 			{renderOpponentBoard()}
	// 		</div>
	// 	</div>
	// );
	return (
		<div className="container">
		  {[...Array(8)].map((_, index) => (
			<div key={index} className='ghost-board'>
			  <div className="opponent-name">
				{opponentName}
			  </div>
			  <div className="opponent-board">
				{renderOpponentBoard()}
			  </div>
			</div>
		  ))}
		</div>
	  );
	  
	  
}
const mapStateToProps = (state) => ({
	opponentBoard: state.opponentBoard,
	opponentName: state.opponentName
});

export default connect(mapStateToProps)(OpponentBoard);
