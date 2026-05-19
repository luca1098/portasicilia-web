'use client'

import { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { HERO_LQIP } from '@/lib/constants/hero-lqip'

type HeroVideoBackgroundProps = {
  alt: string
  posterSrc?: string
  videoSrc?: { desktop: string; mobile: string }
}

const subscribeReducedMotion = (callback: () => void) => {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getShouldPlayVideo = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  const saveData = nav.connection?.saveData === true
  return !reduceMotion && !saveData
}

const getShouldPlayVideoServer = () => false

export default function HeroVideoBackground({
  alt,
  posterSrc = '/images/hero-bg.jpg',
  videoSrc = { desktop: '/videos/hero-bg.mp4', mobile: '/videos/hero-bg-mobile.mp4' },
}: HeroVideoBackgroundProps) {
  const [videoReady, setVideoReady] = useState(false)
  const shouldPlayVideo = useSyncExternalStore(
    subscribeReducedMotion,
    getShouldPlayVideo,
    getShouldPlayVideoServer
  )

  return (
    <>
      <Image
        src={posterSrc}
        alt={alt}
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={HERO_LQIP}
        className="object-cover"
      />
      {shouldPlayVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc.mobile} media="(max-width: 768px)" type="video/mp4" />
          <source src={videoSrc.desktop} type="video/mp4" />
        </video>
      )}
    </>
  )
}
