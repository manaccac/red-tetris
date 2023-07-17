import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Menu = () => {
  const username = Cookies.get('username');

  return (
    <div>
      <div className="menu">
        <li>
          <Link className="button" to={`normal[${username}]`}>Normal</Link>
        </li>
        <li>
          <Link className="button" to={`invisible[${username}]`}>Invisible</Link>
        </li>
        <li>
          <Link className="button" to={`graviter[${username}]`}>Graviter Aléatoire</Link>
        </li>
      </div>
    </div>
  );
};

export default Menu;
