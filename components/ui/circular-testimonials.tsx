'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '@/lib/constants/icons'

export type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

type Colors = {
  name?: string
  designation?: string
  testimony?: string
  arrowBackground?: string
  arrowForeground?: string
  arrowHoverBackground?: string
}

type FontSizes = {
  name?: string
  designation?: string
  quote?: string
}

type Props = {
  testimonials: Testimonial[]
  autoplay?: boolean
  colors?: Colors
  fontSizes?: FontSizes
  previousAriaLabel?: string
  nextAriaLabel?: string
}

function calculateGap(width: number) {
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 60
  const maxGap = 86
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth))
  return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth)
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
  previousAriaLabel = 'Previous testimonial',
  nextAriaLabel = 'Next testimonial',
}: Props) {
  const colorName = colors.name ?? 'var(--color-foreground)'
  const colorDesignation = colors.designation ?? 'var(--color-muted-foreground)'
  const colorTestimony = colors.testimony ?? 'var(--color-foreground)'
  const colorArrowBg = colors.arrowBackground ?? 'var(--color-primary)'
  const colorArrowFg = colors.arrowForeground ?? 'var(--color-primary-foreground)'
  const colorArrowHoverBg = colors.arrowHoverBackground ?? 'var(--color-foreground)'

  const fontSizeName = fontSizes.name ?? '1.5rem'
  const fontSizeDesignation = fontSizes.designation ?? '0.925rem'
  const fontSizeQuote = fontSizes.quote ?? '1.125rem'

  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [containerWidth, setContainerWidth] = useState(1200)

  const imageContainerRef = useRef<HTMLDivElement>(null)
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials])
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials])

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % testimonialsLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [testimonialsLength])

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + testimonialsLength) % testimonialsLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [testimonialsLength])

  const getImageStyle = (index: number): CSSProperties => {
    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.8
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index
    const isRight = (activeIndex + 1) % testimonialsLength === index
    const transition = 'all 0.8s cubic-bezier(.4,2,.3,1)'
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
        transition,
      }
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition,
      }
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition,
      }
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transition,
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!autoplay) return
    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonialsLength)
    }, 5000)
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [autoplay, testimonialsLength])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handlePrev, handleNext])

  return (
    <div className="w-full max-w-4xl">
      <div className="grid gap-16 md:grid-cols-2 md:items-center md:gap-20">
        <div
          ref={imageContainerRef}
          className="relative h-80 w-full md:h-96"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial, index) => (
            <Image
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              className="rounded-3xl object-cover shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
              style={getImageStyle(index)}
            />
          ))}
        </div>
        <div className="flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3
                className="mb-1 font-bold tracking-tight"
                style={{ color: colorName, fontSize: fontSizeName }}
              >
                {activeTestimonial.name}
              </h3>
              <p className="mb-8" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>
                {activeTestimonial.designation}
              </p>
              <p className="leading-relaxed" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                {activeTestimonial.quote}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-10 md:pt-12">
            <button
              type="button"
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label={previousAriaLabel}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
            >
              <ArrowLeft className="size-5" style={{ color: colorArrowFg }} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label={nextAriaLabel}
              className="flex size-11 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
            >
              <ArrowRight className="size-5" style={{ color: colorArrowFg }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularTestimonials
