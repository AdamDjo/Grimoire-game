'use client'

import { motion } from 'framer-motion'

const ORBS = [
  {
    w: 900,
    h: 900,
    top: '-20%',
    left: '-15%',
    dur: 24,
    delay: 0,
    opacity: 0.7,
    color: 'rgba(4,3,2,0.99)',
  },
  {
    w: 1100,
    h: 700,
    top: '-5%',
    left: '30%',
    dur: 30,
    delay: 3,
    opacity: 0.6,
    color: 'rgba(5,3,2,0.98)',
  },
  {
    w: 800,
    h: 1000,
    top: '25%',
    left: '-10%',
    dur: 35,
    delay: 7,
    opacity: 0.65,
    color: 'rgba(3,2,1,0.99)',
  },
  {
    w: 950,
    h: 650,
    top: '40%',
    left: '50%',
    dur: 28,
    delay: 11,
    opacity: 0.6,
    color: 'rgba(4,3,1,0.98)',
  },
  {
    w: 700,
    h: 900,
    top: '60%',
    left: '70%',
    dur: 38,
    delay: 5,
    opacity: 0.65,
    color: 'rgba(5,3,2,0.97)',
  },
  {
    w: 1000,
    h: 600,
    top: '75%',
    left: '10%',
    dur: 26,
    delay: 14,
    opacity: 0.6,
    color: 'rgba(4,3,2,0.98)',
  },
  {
    w: 600,
    h: 800,
    top: '15%',
    left: '60%',
    dur: 32,
    delay: 9,
    opacity: 0.55,
    color: 'rgba(5,4,2,0.97)',
  },
]

const ACCENT_ORBS = [
  { w: 500, h: 400, top: '5%', left: '15%', dur: 18, delay: 2, color: 'rgba(90,55,15,0.35)' },
  { w: 400, h: 400, top: '45%', left: '72%', dur: 22, delay: 6, color: 'rgba(80,48,12,0.3)' },
  { w: 600, h: 350, top: '78%', left: '30%', dur: 20, delay: 10, color: 'rgba(70,42,10,0.32)' },
]

export function SmokeBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${orb.color} 0%, rgba(5,3,2,0.7) 45%, transparent 75%)`,
            filter: 'blur(55px)',
            opacity: orb.opacity,
          }}
          animate={{
            x: [0, 30, -25, 18, 0],
            y: [0, -25, 18, -12, 0],
            scale: [1, 1.06, 0.96, 1.03, 1],
          }}
          transition={{
            duration: orb.dur,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {ACCENT_ORBS.map((orb, i) => (
        <motion.div
          key={`acc-${i}`}
          style={{
            position: 'absolute',
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${orb.color}, transparent 70%)`,
            filter: 'blur(35px)',
            opacity: 0.9,
          }}
          animate={{
            x: [0, -20, 15, -10, 0],
            y: [0, 18, -12, 8, 0],
          }}
          transition={{
            duration: orb.dur,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
