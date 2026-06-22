'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { register as registerUser } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import styles from './page.module.css'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
})

export default function RegisterPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser(email, password, name)
      toast.success('Compte créé ! Vous pouvez vous connecter.')
      router.push('/login')
    } catch {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.brand}>
          <img src="/Logo.png" alt="Abricot" className={styles.logo} />
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Inscription</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Nom</label>
              <input
                {...register('name')}
                type="text"
                className={styles.input}
              />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>

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
              {isSubmitting ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
        </div>

        <p className={styles.bottomText}>
          Déjà inscrit ?{' '}
          <a href="/login" className={styles.actionLink}>
            Se connecter
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
