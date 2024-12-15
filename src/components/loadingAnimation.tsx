"use client"

import React from 'react';
import Image from 'next/image';

export default function LoadingAnimation() {
  return (
    <div className="pointer-events-none">
      <Image 
        src="/loading.gif" 
        alt="Loading..." 
        height={100} 
        width={100} 
      />
    </div>
  );
}
