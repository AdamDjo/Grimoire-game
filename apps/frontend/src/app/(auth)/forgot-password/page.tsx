import Link from 'next/link'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameDivider } from '@/components/ui/grimoire/GameDivider/GameDivider'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'

import type { Metadata } from 'next'

import '../login/login-form.css'

export const metadata: Metadata = {
  title: 'Retrouver votre accès · GRIMOIRE',
}

export default function ForgotPasswordPage() {
  return (
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="main">
      <header className="login-form__header">
        <GameIcon decorative name="unlock" size={48} />
        <p className="login-form__eyebrow">Sceau égaré</p>
        <h1>Retrouver votre accès</h1>
        <p>Nous enverrons les instructions à l’adresse liée à votre chronique.</p>
      </header>
      <GameDivider size="sm" />
      <form className="login-form__fields">
        <GameField label="Adresse de messager">
          <GameInput
            autoComplete="email"
            leadingIcon={<GameIcon decorative name="envelope" size={24} />}
            name="email"
            placeholder="vous@exemple.fr"
            required
            type="email"
          />
        </GameField>
        <GameButton className="login-form__submit" size="lg" type="submit">
          Envoyer les instructions
        </GameButton>
      </form>
      <p className="login-form__footer">
        <Link href="/login">Retour à la connexion</Link>
      </p>
    </GamePanel>
  )
}
