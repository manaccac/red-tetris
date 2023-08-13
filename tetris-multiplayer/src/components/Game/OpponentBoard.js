import React from 'react';
import { connect } from 'react-redux';

function OpponentBoard({ opponentBoards, opponentNames }) {
	console.log("oopppppo ====", opponentBoards);
	console.log("oopppppo names ====", opponentNames);
	
	const renderOpponentBoard = (board) => {
		if (board && Array.isArray(board) && board.length > 0) {
		  return board.flatMap((row, y) =>
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

	return (
		<div className="container">
		  {opponentBoards.map((board, index) => (
			<div key={index} className='ghost-board'>
			  <div className="opponent-name">
				{opponentNames[index]}
			  </div>
			  <div className="opponent-board">
				{renderOpponentBoard(board)}
			  </div>
			</div>
		  ))}
		</div>
	);
}

const mapStateToProps = (props) => ({
	opponentBoards: props.opponentBoards, // Assuming the state has an array of opponent boards
	opponentNames: props.opponentNames // Assuming the state has an array of opponent names
});

export default connect(mapStateToProps)(OpponentBoard);
