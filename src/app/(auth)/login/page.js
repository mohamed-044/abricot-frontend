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
    <div className="min-h-screen flex">
      {/* Colonne gauche — formulaire */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-12">
        {/* Logo */}
        <div>
          <img src="/Logo.png" alt="Abricot" className="h-8" />
        </div>

        {/* Formulaire centré verticalement */}
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-bold text-orange-600 mb-8">Connexion</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Email</label>
              <input
                {...register('email')}
                type="email"
                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Mot de passe</label>
              <input
                {...register('password')}
                type="password"
                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white rounded-md p-3 font-semibold hover:bg-gray-700 transition disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>

            <a href="#" className="text-orange-600 text-sm text-center hover:underline">
              Mot de passe oublié ?
            </a>
          </form>
        </div>

        {/* Lien inscription en bas */}
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-orange-600 hover:underline font-medium">
            Créer un compte
          </a>
        </p>
      </div>

      {/* Colonne droite — photo */}
      <div className="hidden md:block w-1/2 bg-gray-100">
        <img
          src="/login-photo.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}