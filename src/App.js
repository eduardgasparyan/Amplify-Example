import Home from './component/homePage'
import Auth from './component/auth'
import UserHome from './component/userHome'
import ResetPassword from "./component/resetPassword";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Auth />}/>
                <Route path="/user" element={<UserHome />}/>
                <Route path="/reset" element={<ResetPassword />}/>
            </Routes>
    );
}

export default App;

