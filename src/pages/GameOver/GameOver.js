import React from 'react';
import { Link } from 'react-router-dom';

const GameOver = (props) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <h3 className="text-blue-800 text-5xl font-bold pb-5">Game Over</h3>
      <button
        className="bg-teal-800 font-bold text-white rounded-full py-4 mb-4 px-10"
        onClick={props.reset}
      >
        Play Again
      </button>
      <Link to="/">
        <button className="bg-teal-800 font-bold text-white rounded-full py-4 px-10">
          Home
        </button>
      </Link>
    </div>
  );
};

export default GameOver;
