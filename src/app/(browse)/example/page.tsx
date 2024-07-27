"use client"

import React from 'react'

import { getSession } from 'next-auth/react'

const page = () => {

    const userData = async() => {
        const user = await getSession()

        console.log(user)
    }

  return (
    <div>
      <button onClick={userData}>Button</button>
    </div>
  )
}

export default page


