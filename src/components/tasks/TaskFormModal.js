'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/ui/Modal'
import styles from './TaskFormModal.module.css'

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifier' : 'Créer une tâche'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Titre */}
        <div>
          <label className={styles.fieldLabel}>Titre*</label>
          <input
            {...register('title')}
            className={styles.input}
          />
          {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className={styles.fieldLabel}>Description*</label>
          <textarea
            {...register('description')}
            rows={2}
            className={styles.textarea}
          />
          {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
        </div>

        {/* Échéance */}
        <div>
          <label className={styles.fieldLabel}>Échéance*</label>
          <input
            {...register('dueDate')}
            type="date"
            className={styles.input}
          />
          {errors.dueDate && <p className={styles.errorText}>{errors.dueDate.message}</p>}
        </div>

        {/* Assignés */}
        <div>
          <label className={styles.fieldLabel}>Assigné à :</label>
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
                className={styles.input}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          />
          <p className={styles.helperText}>Ctrl+clic pour sélectionner plusieurs</p>
        </div>

        {/* Statut */}
        <div>
          <label className={styles.fieldLabel}>Statut :</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className={styles.statusRow}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`${styles.statusBtn} ${
                      field.value === opt.value
                        ? opt.color + ' border-current'
                        : styles.statusBtnInactive
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
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : '+ Ajouter une tâche'}
        </button>
      </form>
    </Modal>
  )
}