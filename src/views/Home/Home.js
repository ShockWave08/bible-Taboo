import { Link } from 'react-router-dom';

import './home.css';

const Home = () => {
  return (
    <main className="h-screen w-screen box-border bg-blue p-0 m-0">
      <h1 className=" h-auto pt-8 text-white text-5xl text-center font-bold">
        Bible Taboo
      </h1>
      <section className=" h-5/6 w- text-white flex justify-center items-center">
        <Link to="/gameplay">
          <button className="h-auto w-auto py-24 px-14 bg-teal-600 rounded-full text-2xl text-white font-bold">
            Play Game
          </button>
        </Link>
      </section>
    </main>
  );
};

export default Home;
