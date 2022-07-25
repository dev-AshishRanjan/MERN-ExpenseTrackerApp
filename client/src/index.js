import React from 'react';
import ReactDOM from 'react-dom';
import './sass-css/style.css';
import "react-toastify/dist/ReactToastify.css";
import Home from './Home';
import User from './User';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import {SpeechProvider} from "@speechly/react-client"

const Index=()=>{
  return (
    <SpeechProvider appId="a45bc881-5b6e-4fb6-8cb3-2ea8d81bb339" language="en-US">
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/user/:username" element={<User/>}></Route>
          {/* <Route path="*" element={<Error/>}></Route> */}
        </Routes>
    </Router>

    </SpeechProvider>
  )
}
ReactDOM.render(<Index/>, document.getElementById('root'));