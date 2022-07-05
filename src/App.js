import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './views/Home/Home';
import Gameplay from './views/Gameplay/Gameplay';
import SignUp from './views/Signup/SignUp';
import NoPage from './views/NoPage/NoPage';
import Upload from './views/Upload/Upload';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/gameplay" element={<Gameplay />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
