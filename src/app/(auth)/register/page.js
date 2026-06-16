'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { register as registerUser } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register('name')}
              type="text"
              placeholder="Nom complet"
              className="w-full border rounded-lg p-3"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Mot de passe"
              className="w-full border rounded-lg p-3"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white rounded-lg p-3 font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Déjà un compte ?{' '}
          <a href="/login" className="text-orange-500 hover:underline">Se connecter</a>
        </p>
      </div>
    </main>
  )
}