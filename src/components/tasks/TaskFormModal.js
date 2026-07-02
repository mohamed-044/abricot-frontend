'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
  dueDate: z.string().min(1, 'Échéance requise'),
  assigneeIds: z.array(z.string()).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
})

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'À faire', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { value: 'IN_PROGRESS', label: 'En cours', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { value: 'DONE', label: 'Terminée', color: 'bg-green-100 text-green-600 border-green-200' },
]

export default function TaskFormModal({ isOpen, onClose, onSubmit, members = [], defaultValues = null }) {
  const isEdit = !!defaultValues

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      assigneeIds: [],
      status: 'TODO',
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title ?? '',
        description: defaultValues.description ?? '',
        dueDate: defaultValues.dueDate
          ? new Date(defaultValues.dueDate).toISOString().split('T')[0]
          : '',
        assigneeIds: defaultValues.assignees?.map((a) => a.user?.id ?? a.userId) ?? [],
        status: defaultValues.status ?? 'TODO',
      })
    } else {
      reset({ title: '', description: '', dueDate: '', assigneeIds: [], status: 'TODO' })
    }
  }, [defaultValues, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">{isEdit ? 'Modifier' : 'Créer une tâche'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          {/* Titre */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Titre*</label>
            <input
              {...register('title')}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description*</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Échéance */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Échéance*</label>
            <input
              {...register('dueDate')}
              type="date"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
          </div>

          {/* Assignés */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Assigné à :</label>
            <Controller
              name="assigneeIds"
              control={control}
              render={({ field }) => (
                <select
                  multiple
                  value={field.value}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                    field.onChange(selected)
                  }}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-xs text-gray-400 mt-1">Ctrl+clic pour sélectionner plusieurs</p>
          </div>

          {/* Statut */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Statut :</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                        field.value === opt.value
                          ? opt.color + ' border-current'
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-200 text-gray-500 rounded-lg p-3 text-sm font-semibold hover:bg-gray-900 hover:text-white transition disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : '+ Ajouter une tâche'}
          </button>
        </form>
      </div>
    </div>
  )
}