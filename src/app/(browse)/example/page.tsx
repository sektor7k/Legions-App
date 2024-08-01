"use client"

import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

export default function Page() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('https://lottie.host/f9922fbd-b1fe-41dd-af7e-87d4ddbe631e/oDCBA49pXD.json')
      .then(response => response.json())
      .then(data => setAnimationData(data));
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      {animationData && <Lottie options={defaultOptions} height={400} width={400} />}
      </div>
    
  );
}
