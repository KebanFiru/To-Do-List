'use client'

import { useRouter } from "next/navigation"

export default function WelcomePage(){


    const router = useRouter()

    const handleSigInClick = () =>{

        router.push('/signin')
    }

    const hangleSignUpClick = () =>{

        router.push('signup')
    }

    return(
    )
}