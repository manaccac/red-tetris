import React from 'react';
import { connect } from 'react-redux';

function OpponentBoard({ opponents }) {
	console.log("opponents length ====", opponents.length);
	console.log("opponents ====", opponents);
	// console.log("oopppppo names ====", opponentNames);
	
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
            {Object.entries(opponents).map(([name, opponentData], index) => (
                <div key={index} className='ghost-board'>
                    <div className="opponent-name">
                        {name}
                    </div>
                    <div className="opponent-board">
                        {renderOpponentBoard(opponentData.board)}
                    </div>
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = (state) => ({
    opponents: state.opponents
});

export default connect(mapStateToProps)(OpponentBoard);