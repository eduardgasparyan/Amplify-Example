import Home from './component/homePage'
import Login from './component/login'
import UserHome from './component/userHome'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/user" element={<UserHome />}/>
            </Routes>
    );
}

export default App;

