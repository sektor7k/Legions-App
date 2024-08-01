"use client"

import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

export default function LottieModel() {
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
    },
    isClickToPauseDisabled: true // Kullanıcı tıklamalarını devre dışı bırak
  };

  return (
    <div style={{ pointerEvents: 'none' }}>
      {animationData && <Lottie options={defaultOptions} height={600} width={600} />}
    </div>
  );
}
