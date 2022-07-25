import React,{useState,useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import io from 'socket.io-client';

const socket = io.connect("https://mernexpensetracker2112144.herokuapp.com/", { transports: ['websocket', 'polling', 'flashsocket'] });
// const socket = io.connect("http://localhost:3001", { transports: ['websocket', 'polling', 'flashsocket'] });

const Home = () => {
    // const [login,setLogin] =useState(true);
    const [username,setUsername] =useState("");
    const [password,setPassword] =useState("");
    const [checkbox,setCheckbox] =useState(false);
    const [loading, setLoading] = useState(true)
    const navigate=useNavigate();
    const user_list=[];
    // const localUser=localStorage.getItem("users") ? eval(localStorage.getItem("users")) : [{username: "admin", password: "admin"}];
    const [storage, setStorage] = useState([]);
    useEffect(()=>{
        setLoading(true);
        fetch("https://mernexpensetracker2112144.herokuapp.com").then(res=>res.json()).then(res_data=>{
            setStorage(res_data);
            setLoading(false);
        })
    },[]);
    useEffect(()=>{
        if(!loading){
            const str2=storage;
            socket.emit('pushData',str2);
            console.log(str2);
        }
    },[storage]);

    const handleLogin=(e) => {
        e.preventDefault();
        const curr_data=storage.find((element)=>element.username === username);
        // console.log(curr_data);
        if(curr_data){
            if(curr_data.password === password){
                toast.success("Login success");
                navigate(`/user/${username}`);
            }else{
                toast.error("Incorrect Password");
            }
        }else{
            toast.error("Incorrect Username");
        }
    }
    const handleSignup=(e) => {
        e.preventDefault();
        if(!checkbox) {
            toast.error("Please accept terms and conditions.")
        }else{
            if(storage){
                // console.log(storage);
                storage.map((element) => {
                    user_list.push(element);
                });
                const curr_data=storage.find((element)=>element.username === username);
                if(curr_data){
                    toast.info("Username already exists");
                }else{
                    user_list.push({username,password,data:[]});
                    setStorage(user_list);
                    toast.info("User Created successfully");
                }
            }else{
                user_list.push({username,password,data:[]});
                setStorage(user_list);
                toast.info("User Created successfully");
            }
        }
    }
    return (
        <div className="home">
            {/* <video autoPlay muted loop  className="bgVid">
                <source src={Video} type="video/mp4" />
            </video> */}

            {<div className="loginCard">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
                    <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <button type="submit">Sign in</button>
                </form>
                <p>Don't have account - <span onClick={()=>{
                    // setLogin(false);
                    document.querySelector(".loginCard").style.transform="rotateY(180deg)";
                    document.querySelector(".signupCard").style.transform="rotateY(0deg)";
                }}>Sign Up</span> </p>

            </div> }
            {<div className="signupCard">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    {/* <input type="file" name="" id="" /> */}
                    <input type="text" id="name" name="name" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
                    <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <div className="check_box">
                        <input type="checkbox" name="checkbox" id="checkbox" checked={checkbox} onChange={(e)=>setCheckbox(e.target.value)} />
                        <label htmlFor="checkbox">I accept Terms and Conditions</label>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have account - <span onClick={()=>{
                    // setLogin(true);
                    document.querySelector(".loginCard").style.transform="rotateY(0deg)";
                    document.querySelector(".signupCard").style.transform="rotateY(180deg)";
                    
                }}>Sign In</span> </p>

            </div> }
        </div>
    )
}

export default Home;