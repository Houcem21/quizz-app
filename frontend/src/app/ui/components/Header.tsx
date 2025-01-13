import { UserIcon } from '@/assets';
import Image from 'next/image'
import React, { useState } from 'react'

const Header = () => {
    const [isMenuHidden, setIsMenuHidden] = useState(true);

    const Menu = () =>
    <div className={`flex justify-between items-center menu-preview w-screen h-screen z-10 absolute ${isMenuHidden ? "hidden" : "block"}`}>
          <div className={`grid h-full w-50 bg-tertiary-color text-2xl p-10 justify-center items-center`}>
            <a href="/admin">Add question</a>
            <a href="/">Play</a>
            <a href="#">Logout</a>
          </div>
          <div className="clickable w-full h-screen opacity-[.5] bg-black"  onClick={() => setIsMenuHidden(true)} />
    </div>
    
  return (
    <>
    <Menu />
    <header className="h-24 inline-flex w-screen bg-tertiary-color justify-between items-end px-10">
        <Image 
        alt="user icon"
        src={UserIcon}
        width={100}
        height={100}
        />
        <div className="menu-icon h-full flex justify-center items-center" onClick={() => setIsMenuHidden(!isMenuHidden)}>
          <p className="text-3xl">Menu</p>
        </div>
      </header>
    </>
  )
}

export default Header