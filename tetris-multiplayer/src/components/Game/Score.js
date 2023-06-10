import React from 'react';

class Score extends React.Component {
  // Initialisez votre état ici

  render() {
    return (
      <div className="score">
        Score {this.props.player}: {/* Afficher le score ici */}
      </div>
    );
  }
}

export default Score;
