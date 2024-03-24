
import './App.css';
import './styles/main.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './componants/login/Login';
import Register from './componants/register/Register';
import Home from './componants/home/Home';
import ChatProvider from './context/ChatProvider';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import Uploadpage from './componants/uploadpage/Uploadpage';

function App() {
  return (

   <BrowserRouter>
   <ChatProvider>
    <ToastContainer/>
   <Routes>
   <Route path='/login' element={<Login/>}/>
   <Route path='/register' element={<Register/>}/>
   <Route path='/upload-profile' element={<Uploadpage/>} />
   <Route path='/' element={<Home/>} />
   </Routes>
   </ChatProvider>
   </BrowserRouter>
  );
}

export default App;
