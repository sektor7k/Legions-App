"use client"

import React from 'react';
import Image from 'next/image';

export default function ErrorAnimation() {
  return (
    <div className="pointer-events-none">
      <Image 
        src="/error.gif" 
        alt="Error..." 
        height={100} 
        width={100} 
      />
    </div>
  );
}
