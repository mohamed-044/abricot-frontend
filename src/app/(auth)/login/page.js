'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-orange-500 hover:underline">S'inscrire</a>
        </p>
      </div>
    </main>
  )
}