'use client'

import { useRouter } from "next/navigation"
import { useState } from "react";

import DateDiv from "../components/DateDiv";
import TimeTable from "../components/TimeTable";

export default function WelcomePage(){

    const [isLogged, setIsLogged] = useState(false);

    const router = useRouter()

    const handleSigInClick = () =>{

        router.push('/signin')
    }

    const hangleSignUpClick = () =>{

        router.push('signup')
    }

    return(
        <>
            <div className="w-full h-16 border-2 border-blue-500 flex justify-end gap-2 p-1">
                {!isLogged ? (
                    <>
                        <button className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
                        onClick={handleSigInClick}>Sign in</button>
                        <button className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
                        onClick={hangleSignUpClick}>Sign up</button>
                    </>
                    ):(
                        <>
                           <button className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
                            onClick={()=>setIsLogged(false)}>Log out</button>
                        </>
                    )}
                
            </div>
            <div className=" flex flex-ver h-screen"> 
                <div className="flex flex-col gap-5 h-full border border-blue-500">
                    <DateDiv/>
                </div>
                <div>
                    <div></div>
                    <div className="flex flex-ver gap-5">
                        <div>Add</div>
                        <div>Remove</div>
                    </div>
                </div>
            </div>
        </>       
    )
}