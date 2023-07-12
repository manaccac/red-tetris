import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Menu = () => {
  const username = Cookies.get('username');

  useEffect(() => {
	console.log("inmenu");
  }, []);

  return (
    <div>
      <div className="menu">
        <li>
          <Link className="button" to={`mode1[${username}]`}>Mode 1</Link>
        </li>
        <li>
          <Link className="button" to={`mode2[${username}]`}>Mode 2</Link>
        </li>
        <li>
          <Link className="button" to={`mode3[${username}]`}>Mode 3</Link>
        </li>
      </div>
    </div>
  );
};

export default Menu;
