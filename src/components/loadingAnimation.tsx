"use client"

import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

export default function LoadingAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/loading.json')
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
      {animationData && <Lottie options={defaultOptions} height={200} width={200} />}
    </div>
  );
}
