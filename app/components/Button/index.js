import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const Button = ({text, bgColor, color, width, path, src}) => {
  return (
    <Link href={path}>
      <button
        className={`text-sm tablet:text-base py-2 px-5 flex justify-center items-center hover:opacity-90 gap-1 rounded-[30px] border border-primary text-center ${color} ${bgColor} ${width}`}
      >
        {text}
        {src && <Image src={src} alt="" height={20} width={20}/>}
      </button>
    </Link>
  );
}

export default Button