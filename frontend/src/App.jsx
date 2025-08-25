import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import {currencies} from "./currencies"
const App = () =>{
  const[basecurrency, setBasecurrency]=useState("INR")
  const[amount, setAmount]=useState(0)
  const[selectedcurrency, setSelectedcurrency]=useState("")
  const[conversionHistory, setConversionHistory]=useState([])

  useEffect(()=>{
    const savedHistory=JSON.parse(localStorage.getItem("history")) || []
    setConversionHistory(savedHistory)
  },[])

  const savedHistory=(entry)=>{
    const updatedhistory=[entry, ...conversionHistory]
    setConversionHistory(updatedhistory)
    localStorage.setItem("history",JSON.stringify(updatedhistory))
  }
  const convertcurrency=async()=>{
    try {
        const {data} = await axios.get(`https://currency-bakend.onrender.com/convert?base_currency=${basecurrency}&currencies=${selectedcurrency}`)
        let result= Object.values(data.data)[0] * amount
        let roundres=result.toFixed(2)
        const countryCode = currencies.find(currency => currency.code === selectedcurrency)
        savedHistory({
        result: roundres,
        flag: countryCode.flag,
        symbol:countryCode.symbol,
        code:countryCode.code,
        countryName:countryCode.name,
        date:new Date().toLocaleString()
    })
      
    } catch (error) {
      alert("Error fetching conversion rates")
    }
  
  }

  const deleteHistory=(index)=>{
    const updatedhistory=conversionHistory.filter((_, i)=> i!==index)
    localStorage.setItem("history",JSON.stringify(updatedhistory))
    setConversionHistory(updatedhistory)
  }

  return (
    <>
      <div className='h-screen bg-gradient-to-r from-pink-500 to purple-600 flex items-center 
      justify-end p-5 md:px-20'>
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-[660px] h-full overflow-hidden'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6 overflow-hidden'>
            Smart Currency Converter</h1>
        
          <div className='mb-4 px-1'>
            <label className='block text-gray-700'>Base Currency</label>
            <select className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg
            p-2 my-1' value={basecurrency} onChange={(e)=>setBasecurrency(e.target.value)}>
              {
                currencies.map(element=>{
                  return(
                    <option key={element.code} value={element.code}>{element.name}</option>
                  )
                })
              }
            </select>
          </div>

          <div className='mb-4 px-1'>
            <label className='block text-gray-700'>Amount</label>
            <input type="text" className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg
          p-2 my-1' value={amount} onChange={(e)=>setAmount(e.target.value)}/>
          </div>
              <div className='flex justify-end'>
                <button className='bg-pink-400 text-white p-3 rounded-lg font-semibold text-xl
                w-52 transition-all duration-300 hover:bg-pink-500 m-4 pt-8' 
                onClick={convertcurrency}>Convert</button>
              </div>

               <div className='mb-4 px-1'>
              <label className='block text-gray-700'>Currencies to convert</label>
                 <select className='w-full border-green-300 bg-gray-200 font-semibold text-xl rounded-lg
            p-2 my-1' value={selectedcurrency} onChange={(e)=>setSelectedcurrency(e.target.value)}>
              {
                currencies.map(element=>{
                  return(
                    <option key={element.code} value={element.code}>{element.name}</option>
                  )
                })
              }
            </select>
            </div>

          <div className='mt-6 px-1'>
            <h2 className='text-2xl px-1 font-bold text-gray-800 mb-4'>Conversion History</h2>
          </div>

          <div className='px-1 h-[400px]'>
              <ul className='px-1 '>
                {
                  conversionHistory.length > 0 ? (conversionHistory.map((element,index)=>{
                    return(
                      <li key={index} className='text-gray-700 mb-4 flex justify-between items-center'>
                        <div className='flex items-center gap-5'>
                        <img src={`https://flagcdn.com/w40/${element.flag}.png`} alt="Country Flag" 
                        className='w-11 h-11'/>
                        <p className='flex flex-col gap-1 text-gray-500 font-medium'>
                          <span className='text-xl font-semibold text-black'>
                            {element.symbol}  {element.result}</span>
                          <span>{element.code} - {element.countryName}</span>
                        </p>
                        </div>
                        <span onClick={()=> deleteHistory(index)} className='text-gray-500 font-bold text-xl hover:cursor:pointer'>x</span>
                      </li>
                    )
                  })):(<p className='text=lg 
                    text-gray-500 font-bold
                    '>Conversion history is empty</p>)
                }
              </ul>
          </div>
            

        </div>
      </div>
    </>
  )
}

export default App
