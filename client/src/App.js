import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import NavBar from './components/navBar/NavBar';
import AddProblem from './components/addProblem/AddProblem.jsx'
function App() {
    return (
        <div className="app">
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add' element={<AddProblem />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </div>
    );
}
export default App
