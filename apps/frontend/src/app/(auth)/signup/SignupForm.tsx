import Link from 'next/link'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameDivider } from '@/components/ui/grimoire/GameDivider/GameDivider'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'

import '../login/login-form.css'

export function SignupForm() {
  return (
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="main">
      <header className="login-form__header">
        <GameIcon decorative name="book" size={48} />
        <p className="login-form__eyebrow">Une légende commence</p>
        <h1>Créer votre chronique</h1>
        <p>Choisissez vos sceaux d’accès. Votre personnage viendra ensuite.</p>
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
        <GameField hint="Douze caractères minimum." label="Mot de passe">
          <GameInput
            autoComplete="new-password"
            leadingIcon={<GameIcon decorative name="lock" size={24} />}
            minLength={12}
            name="password"
            placeholder="Forgez un mot de passe"
            required
            type="password"
          />
        </GameField>
        <GameButton className="login-form__submit" size="lg" type="submit">
          Ouvrir le Grimoire
        </GameButton>
      </form>

      <p className="login-form__footer">
        Chronique existante ? <Link href="/login">Se connecter</Link>
      </p>
    </GamePanel>
  )
}
