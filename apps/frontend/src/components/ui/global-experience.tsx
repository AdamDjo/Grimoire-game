'use client'

import dynamic from 'next/dynamic'

import { LanguageSwitcher } from './language-switcher'

const CustomCursor = dynamic(
  () => import('./custom-cursor').then((module) => module.CustomCursor),
  { ssr: false }
)

export function GlobalExperience() {
  return (
    <>
      <CustomCursor />
      <LanguageSwitcher />
    </>
  )
}
