'use client'

import { motion } from 'framer-motion'

const CLOUDS = [
  { top: '8%', left: '-8%', w: 180, delay: 0, dur: 18 },
  { top: '35%', left: '-5%', w: 130, delay: 3, dur: 22 },
  { top: '65%', left: '-10%', w: 160, delay: 6, dur: 20 },
  { top: '15%', right: '-8%', w: 150, delay: 2, dur: 19 },
  { top: '55%', right: '-6%', w: 140, delay: 5, dur: 24 },
  { top: '80%', right: '-5%', w: 120, delay: 8, dur: 21 },
]

function CloudShape({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="70" rx="90" ry="32" fill="rgba(240,240,255,0.7)" />
      <ellipse cx="70" cy="58" rx="55" ry="38" fill="rgba(240,240,255,0.6)" />
      <ellipse cx="130" cy="55" rx="48" ry="34" fill="rgba(240,240,255,0.5)" />
      <ellipse cx="100" cy="48" rx="40" ry="30" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

export function FloatingClouds() {
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: 'left' in c ? (c as { left: string }).left : undefined,
            right: 'right' in c ? (c as { right: string }).right : undefined,
            opacity: 0.55,
            filter: 'blur(3px)',
          }}
          animate={{ x: ['left' in c ? -10 : 10, 'left' in c ? 10 : -10] }}
          transition={{
            duration: c.dur,
            delay: c.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <CloudShape width={c.w} />
        </motion.div>
      ))}
    </div>
  )
}
