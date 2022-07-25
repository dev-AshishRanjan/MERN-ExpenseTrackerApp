const express=require('express');
const app=express();
const http=require('http');
const mongoose=require('mongoose');

const server=http.createServer(app);
const port =process.env.PORT || 3001;
const {Server} =require("socket.io");
const cors = require("cors");

var storage=[{username:"initial",password:"i",data:[{type:"Income",category:"Salary",id:"1",date:"2022-5-5",price:"50"}]}];

const Contact=[];


mongoose.connect("mongodb://Ashish144:password1234@cluster0-shard-00-00.3dxea.mongodb.net:27017,cluster0-shard-00-01.3dxea.mongodb.net:27017,cluster0-shard-00-02.3dxea.mongodb.net:27017/?ssl=true&replicaSet=atlas-zc5bif-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
var db=mongoose.connection;
db.on("error",()=> console.log("**database Error**"));
db.once("open",()=>{
    console.log("**database connection successfully**");
});
var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    data:Array
});
var UserModel=mongoose.model("user",UserSchema);


app.use(cors());

const io= new Server(server,{
    cors: {
        origin: 'https://mern-expensetracker144.netlify.app',
        // origin: 'http://localhost:3000',
        method: ["GET","POST"],
        credentials: true
    },
});

io.on("connection", (socket)=>{
    console.log(`user connected : ${socket.id}`);
    socket.on("pushData",(data)=>{
        console.log(data);
        storage=data;
        UserModel.remove({},()=> console.log("Collection cleared"));   //removing all contents from the collection of database
        storage.map((element)=>{
            var singleUser=new UserModel(element);
            singleUser.save((err,data)=>{
                if(err){
                    return console.log({err});
                }
                console.log(data);
                
            })
        })
        socket.broadcast.emit("receive_message",storage);
    });
});

app.get("/",(req,res)=>{
    UserModel.find((err,data)=>{
        console.log({err,data});
        storage=data;
    })
    // storage=incomingData;
    res.send(JSON.stringify(storage));
});

server.listen(port,()=>{
    console.log("**Server is running**");
})