import Link from 'next/link'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameDivider } from '@/components/ui/grimoire/GameDivider/GameDivider'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'

import './login-form.css'

export function LoginForm() {
  return (
    <GamePanel className="login-form" ornament="diamond" padding="lg" variant="main">
      <header className="login-form__header">
        <GameIcon decorative name="key" size={48} />
        <p className="login-form__eyebrow">Les portes de Velkhar</p>
        <h1>Reprendre votre chronique</h1>
        <p>Vos choix, vos souvenirs et les traces laissées dans le monde vous attendent.</p>
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

        <GameField label="Mot de passe">
          <GameInput
            autoComplete="current-password"
            leadingIcon={<GameIcon decorative name="lock" size={24} />}
            name="password"
            placeholder="Votre mot de passe"
            required
            type="password"
          />
        </GameField>

        <div className="login-form__options">
          <label className="login-form__remember">
            <input name="remember" type="checkbox" />
            <span>Se souvenir de moi</span>
          </label>
          <Link href="/forgot-password">Mot de passe oublié ?</Link>
        </div>

        <GameButton className="login-form__submit" size="lg" type="submit">
          Entrer dans le Grimoire
        </GameButton>
      </form>

      <p className="login-form__footer">
        Première visite ? <Link href="/signup">Créer votre chronique</Link>
      </p>
    </GamePanel>
  )
}
