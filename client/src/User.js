import React,{useState,useEffect,useRef} from 'react';
import {useParams} from 'react-router-dom';
import { toast } from "react-toastify";
import { BiBarChartAlt2 , BiDoughnutChart } from "react-icons/bi";
import { FcBarChart,FcDoughnutChart } from "react-icons/fc";
import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import {Chart as ChartJs ,registerables } from 'chart.js';
import { AiFillDollarCircle,AiFillDelete } from "react-icons/ai";
import { useSpeechContext } from '@speechly/react-client';
import { PushToTalkButton,PushToTalkButtonContainer } from '@speechly/react-ui';
import io from 'socket.io-client';

const socket = io.connect("https://mernexpensetracker2112144.herokuapp.com", { transports: ['websocket', 'polling', 'flashsocket'] });
// const socket = io.connect("http://localhost:3001", { transports: ['websocket', 'polling', 'flashsocket'] });



const User = () => {
    const {username}=useParams();
    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [storage, setStorage] = useState([]);
    const [dough1,setDough1] = useState(true);
    const [dough2,setDough2] = useState(true);
    var totalIncome=0;
    var totalincome=0;
    var totalExpense=0;
    var totalexpense=0;
    const[incomeData,setIncomeData] = useState([]);
    const[expenseData,setExpenseData] = useState([]);
    const [type,setType]=useState("");
    const [category,setCategory]=useState("");
    const [price,setPrice]=useState("");
    const [date,setDate]=useState("");
    const [totalBalance,setTotalBalance] = useState("");
    const incMark=Math.round(255/11);
    const incomeColors={Business:`rgb(0,${incMark},0)`,Investment:`rgb(0,${incMark*2},0)`,"Extra Income":`rgb(0,${incMark*3},0)`,Deposits:`rgb(0,${incMark*4},0)`,Lottery:`rgb(0,${incMark*5},0)`,Gifts:`rgb(0,${incMark*6},0)`,Salary:`rgb(0,${incMark*7},0)`,Savings:`rgb(0,${incMark*8},0)`,"Retail Income":`rgb(0,${incMark*9},0)`,Others:`rgb(0,${incMark*10},0)`};
    const expMark=Math.round(255/12);
    const expenseColors={Bills:`rgb(${expMark} , 0 ,0)`,Car:`rgb(${expMark*2} , 0 ,0)`,Clothes:`rgb(${expMark*3} , 0 ,0)`,Travel:`rgb(${expMark*4} , 0 ,0)`,Food:`rgb(${expMark*5} , 0 ,0)`,Shopping:`rgb(${expMark*6} , 0 ,0)`,House:`rgb(${expMark*7} , 0 ,0)`,Entertainment:`rgb(${expMark*8} , 0 ,0)`,Phone:`rgb(${expMark*9} , 0 ,0)`,Pets:`rgb(${expMark*10} , 0 ,0)`,Others:`rgb(${expMark*11} , 0 ,0)`};

    const {segment}= useSpeechContext();

    const expenseCategory=["Bills","Car","Clothes","Travel","Food","Shopping","House","Entertainment","Phone","Pets","Others"];
    const incomeCategory=["Business","Investment","Extra Income","Deposits","Lottery","Gifts","Salary","Savings","Retail Income","Others"];


    useEffect(() => {
        setLoading(true);
        fetch("https://mernexpensetracker2112144.herokuapp.com").then(res=>res.json()).then(res_data=>{
        // fetch("http://localhost:3001").then(res=>res.json()).then(res_data=>{
            setStorage(res_data);
            setLoading(false);
        });
    },[])
    
    // useEffect(()=>{
    //     console.log("Oeffect");
    //     socket.on('receive_message',(data)=>{
    //         console.log(storage);
    //         setStorage(data);
    //     });
    //     console.log(new Date().getTime());
    // },[socket]);

    useEffect(()=>{
        if(!loading){
            socket.emit('pushData',storage);
            console.log(storage);
        }
    },[storage]);


    useEffect(() => {
        if(storage){
            // console.log({storage});
            const current_data = storage.find((element) => element.username === username);
            if(current_data){
                setData(current_data.data);
                setTotalBalance(totalIncome-totalExpense);
            }
        }
        // incomeData.map((e)=> totalIncome += parseInt(e.price))
        // expenseData.map((e)=> totalExpense += parseInt(e.price))
        // setTotalBalance(totalIncome-totalExpense);
    },[storage])
    useEffect(() => {
        incomeData.map((e)=> totalIncome += parseInt(e.price))
        expenseData.map((e)=> totalExpense += parseInt(e.price))
        setTotalBalance(totalIncome-totalExpense);
    },[incomeData,expenseData])


    useEffect(() => {
        setExpenseData(data.filter((element)=> element.type === "Expense"));
        setIncomeData(data.filter((element)=> element.type === "Income"));
        // incomeData.map((e)=> totalIncome += parseInt(e.price))
        // expenseData.map((e)=> totalExpense += parseInt(e.price))

    },[data]);

    // const incomeData=data.filter((element)=> element.type !== "Expense");
    // const expenseData=data.filter((element)=> element.type !== "Income");
    const doughnutData=(chartdata)=>{
        if(chartdata){
            return {
            datasets:[{
                data:chartdata.map((e)=> e.price),
                backgroundColor: chartdata.map((e)=>{
                    var cat = String(e.category);
                    if(incomeCategory.includes(cat)){
                        // console.log(incomeColors[cat]);
                        return incomeColors[cat];
                    }else{
                        return expenseColors[cat];
                    }
                })
            }],
            labels:chartdata.map((e)=> e.category)
            }
        }
    }
    const barData=(chartdata)=>{
        if(chartdata){
            return {
                datasets:[{
                    type:"line",
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    fill: false,
                    label:`Line Data`,
                    data:chartdata.map((e)=> e.price),
                    // backgroundColor: `${chartdata.type === 'income' ? "rgba(0,155,0,0.5) ":"rgba(155,0,0,0.5)"}`
                },
                {
                    type:"bar",
                    label:`Bar Data`,
                    data:chartdata.map((e)=> e.price),
                    backgroundColor: chartdata.map((e)=>{
                        var cat = String(e.category);
                        if(incomeCategory.includes(cat)){
                            // console.log(incomeColors[cat]);
                            return incomeColors[cat];
                        }else{
                            return expenseColors[cat];
                        }
                    })
                }
            ],
                labels:chartdata.map((e)=> e.category)
            }
        }
    }

    const handleChartChange1=()=>{
        setDough1(!dough1);
    }
    const handleChartChange2=()=>{
        setDough2(!dough2);
    }

    const handleFormData=()=>{
        // console.log(type,category,price,date);
        if(type && category && price && date){
            const newData={type,category,price,date,id:new Date().getTime().toString()};
            data.unshift(newData);
            setExpenseData(data.filter((element)=> element.type === "Expense"));
            setIncomeData(data.filter((element)=> element.type === "Income"));
            // data.reverse();
            // setTotalBalance(totalIncome-totalExpense);
            // const current ={username:username,data:data};
            // bigUserData.push({username,data});
            const current_data = storage.find((element) => element.username === username);
            current_data["data"]=data;
            const new_storage=storage.filter((element) => element.username !== username);
            // console.log(new_storage);
            if(new_storage !==[]){
                setStorage([...new_storage,current_data]);
            }else{
                setStorage([current_data]);
            }
            toast.success(`Entry created - ${newData.id}`)
        }else{
            toast.error("Fill all the fields for Entry");
        }
    }

    const handleDelete=(id)=>{
        // console.log(id);
        const newData=data.filter((element)=> element.id !== id);
        // data.remove(newData);
        // console.log(newData);
        setData(newData);
        const current_data = storage.find((element) => element.username === username);
        current_data["data"]=newData;
        const new_storage=storage.filter((element) => element.username !== username);
        // console.log(new_storage);
        if(new_storage !==[]){
            setStorage([...new_storage,current_data]);
        }else{
            setStorage([current_data]);
        }
        toast.success(`Entry deleted - ${id}`)
    }

    useEffect(() => {
        if(segment){
            if(segment.intent.intent === "add_expense"){
                setType("Expense");
            } else if(segment.intent.intent === "add_income"){
                setType("Income");
            } else if(segment.isFinal && segment.intent.intent === "create_transaction"){
                return handleFormData();
            } else if(segment.isFinal && segment.intent.intent === "cancel_transaction"){
                setType("");
                setCategory("");
                setPrice("");
                setData("");
            } 

            segment.entities.forEach((e)=>{
                const category= `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`;
                switch (e.type) {
                    case "price":
                        setPrice(e.value)
                        break;
                    case "category":
                        if(incomeCategory.includes(category)){
                            setCategory(category);
                            setType("Income");
                        }else if(expenseCategory.includes(category)){
                            setCategory(category);
                            setType("Expense");
                        }
                        break;
                    case "date":
                        setDate(e.value)
                        break;
                    default:
                        break;
                }
            });

            if(segment.isFinal){
                handleFormData();
            }
            // console.log(segment);
        }
    },[segment]);



    ChartJs.register(...registerables );
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Multitype Chart',
            },
        },
    };

    // console.log({data,incomeData,expenseData});
    // console.log(segment);
    return (
        <div className="user">

            <div className="midCard mobile">
                <p className="welcome">Welcome, <span>{username}</span></p>
                <p className="balance">Total Balance: <strong>{totalBalance}</strong> USD </p>
                <h5> <p>Try Saying :</p> Add Income for $50 in Category Salary for Monday</h5>
                <div className="speechly_input">
                    {segment && segment.words.map((w)=>w.value).join(" ")}
                </div>
                <div className="form">
                    <div className="line1">
                        <select name="type" id="type"  value={type}  onChange={(e)=>setType(e.target.value)}>
                            <option value="" disabled defaultValue>Type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                        <select name="category" id="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
                            <option value="" disabled defaultValue>Category</option>
                            {
                                type==="Income" ?
                                incomeCategory.map((element)=>{
                                    return <option value={element}>{element}</option>
                                }):
                                expenseCategory.map((element)=>{
                                    return <option value={element}>{element}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="line2">
                        <input type="number" placeholder='$ Price'value={price} onChange={(e)=>setPrice(e.target.value)} />
                        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
                    </div>
                    <button onClick={handleFormData}>Create</button>
                </div>
                <div className="dataCharts">
                    {
                        data && data.map((element)=>{
                            return(
                                <div className="dataChart" key={element.id}>
                                    {element.type ==="Income"? <div className="icon_dollar_income"><AiFillDollarCircle/></div> :<div className="icon_dollar_expense"><AiFillDollarCircle/></div>}
                                    <div className="details">
                                        <h3>{element.category}</h3>
                                        <p>${element.price} &nbsp; {element.date}</p>
                                    </div>
                                    <AiFillDelete className="delete" onClick={()=>handleDelete(element.id)}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {
                incomeData &&  <div className="sideCard incomeCard">
                <h2>Income</h2>
                <div className="icon">
                    <span>${incomeData.map((e)=> totalincome += parseInt(e.price)) && totalincome}</span>
                    {dough1 ? <FcBarChart onClick={handleChartChange1}/> : <FcDoughnutChart onClick={handleChartChange1}/>}
                </div>
                <div className="chart">
                    {dough1 ?<Doughnut data={doughnutData(incomeData)}/> :<Chart type="bar" data={barData(incomeData)} options={options}/> }
                </div>
            </div>
            }

            <div className="midCard desktop">
                <p className="welcome">Welcome, <span>{username}</span></p>
                <p className="balance">Total Balance: <strong>{totalBalance}</strong> USD </p>
                <h5> <p>Try Saying :</p> Add Income for $50 in Category Salary for Monday</h5>
                <div className="speechly_input">
                    {segment && segment.words.map((w)=>w.value).join(" ")}
                </div>
                <div className="form">
                    <div className="line1">
                        <select name="type" id="type"  value={type}  onChange={(e)=>setType(e.target.value)}>
                            <option value="" disabled defaultValue>Type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                        <select name="category" id="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
                            <option value="" disabled defaultValue>Category</option>
                            {
                                type==="Income" ?
                                incomeCategory.map((element)=>{
                                    return <option value={element}>{element}</option>
                                }):
                                expenseCategory.map((element)=>{
                                    return <option value={element}>{element}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="line2">
                        <input type="number" placeholder='$ Price'value={price} onChange={(e)=>setPrice(e.target.value)} />
                        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
                    </div>
                    <button onClick={handleFormData}>Create</button>
                </div>
                <div className="dataCharts">
                    {
                        data && data.map((element)=>{
                            return(
                                <div className="dataChart" key={element.id}>
                                    {element.type ==="Income"? <div className="icon_dollar_income"><AiFillDollarCircle/></div> :<div className="icon_dollar_expense"><AiFillDollarCircle/></div>}
                                    <div className="details">
                                        <h3>{element.category}</h3>
                                        <p>${element.price} &nbsp; {element.date}</p>
                                    </div>
                                    <AiFillDelete className="delete" onClick={()=>handleDelete(element.id)}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {
                expenseData &&  <div className="sideCard expenseCard">
                <h2>Expense</h2>
                <div className="icon">
                    <span>${expenseData.map((e)=> totalexpense += parseInt(e.price)) && totalexpense}</span>
                    {dough2 ? <FcBarChart onClick={handleChartChange2}/> : <FcDoughnutChart onClick={handleChartChange2}/>}
                </div>
                <div className="chart">
                    {dough2 ?<Doughnut data={doughnutData(expenseData)}/> :<Chart type="bar" data={barData(expenseData)} options={options}/> }
                </div>
            </div>
            }

            <PushToTalkButtonContainer >
                <PushToTalkButton onClick={window.scrollTo(0,0)}/>
                {/* <ErrorPanel/> */}
            </PushToTalkButtonContainer>
        </div>
    )
}


export default User