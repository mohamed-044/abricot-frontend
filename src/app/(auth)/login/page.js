'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import styles from './page.module.css'
const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
export default function LoginPage() {
  const { setUser } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })
  const onSubmit = async ({ email, password }) => {
    try {
      const data = await login(email, password)
      setUser(data.user)
      router.push('/dashboard')
    } catch {
      toast.error('Email ou mot de passe incorrect')
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.brand}>
          <img src="/Logo.png" alt="Abricot" className={styles.logo} />
        </div>
        <div className={styles.hero}>
          <h1 className={styles.title}>Connexion</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                {...register('email')}
                type="email"
                className={styles.input}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Mot de passe</label>
              <input
                {...register('password')}
                type="password"
                className={styles.input}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.button} ${isSubmitting ? styles.buttonDisabled : ''}`}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
            <a href="#" className={styles.forgotLink}>
              Mot de passe oublié ?
            </a>
          </form>
        </div>
        <p className={styles.bottomText}>
          Pas encore de compte ?{' '}
          <a href="/register" className={styles.actionLink}>
            Créer un compte
          </a>
        </p>
      </div>
      <div className={styles.photoColumn}>
        <img
          src="/login-photo.jpg"
          alt=""
          className={styles.photoImage}
        />
      </div>
    </div>
  )
}
