import React from 'react';
import { connect } from 'react-redux';

function OpponentBoard({ opponents }) {

	
	const renderOpponentBoard = (board) => {
		if (board && Array.isArray(board) && board.length > 0) {
			return board.flatMap((row, y) =>
				row.map((cell, x) => (
					<div
						key={`cell-${y}-${x}`}
						className={`opponent-board-cell ${cell !== 0 ? 'filled' : ''}`}
						data-testid={cell !== 0 ? 'opponent-board-cell-filled' : 'opponent-board-cell-empty'}
					></div>
				))
			);
		} else {
			return null;
		}
	};
	

    return (
        <div className="container">
        	{opponents && Object.entries(opponents).map(([name, opponentData, image, win], index) => (
                <div key={index} className='ghost-board' data-testid="container">
					<div className='inline'>
						<img src={`/user_pic/${opponentData.image}-removebg-preview.png`} alt="Profile" className="profile-image-oppo" />

						<div className="opponent-name">
							{name}
						</div>
						<img src="/crown.png" alt="Crown" className="crown-icon" />
						{opponentData.win}
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
