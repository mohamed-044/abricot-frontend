'use client'

import { useAuth } from '@/context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { updateProfile, updatePassword } from '@/services/authService'
import { useEffect } from 'react'
import { toast } from 'sonner'
import styles from './page.module.css'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const profileSchema = z
  .object({
    name: z.string().min(2, 'Nom requis'),
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .optional()
      .refine(
        (value) => !value || passwordRegex.test(value),
        {
          message:
            'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
        }
      ),
    currentPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.password || (!!data.currentPassword && data.currentPassword.trim() !== ''),
    {
      path: ['currentPassword'],
      message: 'Mot de passe actuel requis pour modifier le mot de passe',
    }
  )

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()

  const {
    register: registerProfile,
    handleSubmit: handleProfile,
    setError,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', password: '', currentPassword: '' },
  })

  // Pré-remplir le formulaire quand user est chargé
  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name, email: user.email })
    }
  }, [user, resetProfile])

  const profileMutation = useMutation({
    mutationFn: ({ name, email }) => updateProfile({ name, email }),
    onSuccess: (userData) => {
      setUser(userData)
      toast.success('Profil mis à jour !')
    },
    onError: () => toast.error('Erreur lors de la mise à jour du profil'),
  })

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, password }) =>
      updatePassword({ currentPassword, newPassword: password }),
    onSuccess: () => toast.success('Mot de passe mis à jour !'),
    onError: (error) => {
      const response = error?.response?.data
      if (response?.data?.errors?.length > 0) {
        response.data.errors.forEach((validationError) => {
          setError(validationError.field, {
            type: 'server',
            message: validationError.message,
          })
        })
      }
      const message =
        response?.message || 'Erreur lors de la mise à jour du mot de passe'
      toast.error(message)
    },
  })

  const onSubmit = async (data) => {
    const { name, email, password, currentPassword } = data
    try {
      const userData = await profileMutation.mutateAsync({ name, email })
      setUser(userData)
      if (password) {
        await passwordMutation.mutateAsync({ currentPassword, password })
      }
    } catch {
      // already handled by each mutation's onError
    }
  }

  // Séparer nom et prénom
  const nameParts = user?.name?.split(' ') ?? []
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') ?? ''

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* En-tête */}
        <h1 className={styles.title}>Mon compte</h1>
        <p className={styles.subtitle}>{user?.name}</p>

        {/* Formulaire profil */}
        <form onSubmit={handleProfile(onSubmit)} className={styles.form}>
          <div>
            <label className={styles.label}>Nom</label>
            <input
              {...registerProfile('name')}
              placeholder={lastName}
              className={styles.input}
            />
            {profileErrors.name && (
              <p className={styles.error}>{profileErrors.name.message}</p>
            )}
          </div>

          <div>
            <label className={styles.label}>Prénom</label>
            <input
              placeholder={firstName}
              disabled
              className={`${styles.input} ${styles.inputDisabled}`}
            />
          </div>

          <div>
            <label className={styles.label}>Email</label>
            <input
              {...registerProfile('email')}
              type="email"
              className={styles.input}
            />
            {profileErrors.email && (
              <p className={styles.error}>{profileErrors.email.message}</p>
            )}
          </div>

          <div>
            <label className={styles.label}>Mot de passe actuel</label>
            <input
              {...registerProfile('currentPassword')}
              type="password"
              placeholder="••••••••••••"
              className={styles.input}
            />
            {profileErrors.currentPassword && (
              <p className={styles.error}>{profileErrors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className={styles.label}>Nouveau mot de passe</label>
            <input
              {...registerProfile('password')}
              type="password"
              placeholder="••••••••••••"
              className={styles.input}
            />
            {profileErrors.password && (
              <p className={styles.error}>{profileErrors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={profileSubmitting || profileMutation.isPending || passwordMutation.isPending}
            className={`${styles.button} ${styles.buttonMargin}`}
          >
            Modifier les informations
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className={`${styles.button} ${styles.logoutButton}`}
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}