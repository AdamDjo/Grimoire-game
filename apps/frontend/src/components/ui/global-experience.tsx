'use client'

import dynamic from 'next/dynamic'

const CustomCursor = dynamic(
  () => import('./custom-cursor').then((module) => module.CustomCursor),
  { ssr: false }
)

export function GlobalExperience() {
  return <CustomCursor />
}
