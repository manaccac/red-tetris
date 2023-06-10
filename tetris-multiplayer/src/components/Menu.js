import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div>
      <div className="menu">
        <li>
          <Link className="button" to="/game/mode1">Mode 1</Link>
        </li>
        <li>
          <Link className="button" to="/game/mode2">Mode 2</Link>
        </li>
        <li>
          <Link className="button" to="/game/mode3">Mode 3</Link>
        </li>
      </div>
    </div>
  );
};

export default Menu;
