import React, { Component } from 'react';

class Piece extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Créez une matrice 2D pour représenter une pièce
      piece: [
        [1, 1],
        [1, 1]
      ],
      position: { x: 0, y: 0 },  // position initiale en haut à gauche
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState((state) => ({
      position: { x: state.position.x, y: state.position.y + 1 },
    }));
  }

  render() {
    return (
      <div>
        {this.state.piece.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${cell ? 'filled' : ''}`}
              style={{ top: `${(this.state.position.y + i) * 5}%`, left: `${(this.state.position.x + j) * 10}%` }}
            ></div>
          ))
        )}
      </div>
    );
  }
}

export default Piece;
