'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProject,
  updateProject,
  addProjectContributor,
  removeProjectContributor,
} from '@/services/projectService'
import { toast } from 'sonner'
import Modal from '@/components/ui/Modal'
import ContributorSelect from '@/components/ui/ContributorSelect'
import styles from './ProjectModal.module.css'

const schema = z.object({
  name: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
})

export default function ProjectModal({ isOpen, onClose, project = null }) {
  const isEdit = !!project
  const queryClient = useQueryClient()
  const [contributors, setContributors] = useState(
    project?.members
      ?.filter((m) => m.role !== 'OWNER')
      .map((m) => m.user.email) ?? []
  )

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
    },
  })

  useEffect(() => {
    if (project) {
      reset({
        name: project.name ?? '',
        description: project.description ?? '',
      })
      setContributors(
        project.members
          ?.filter((m) => m.role !== 'OWNER')
          .map((m) => m.user.email) ?? []
      )
    }
  }, [project, reset])

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!isEdit) {
        return createProject({ ...values, contributors })
      }

      const currentContributorEmails = contributors
      const existingContributorEmails = project?.members
        ?.filter((m) => m.role !== 'OWNER')
        .map((m) => m.user.email) ?? []

      const toAdd = currentContributorEmails.filter(
        (email) => !existingContributorEmails.includes(email)
      )
      const toRemove = project?.members
        ?.filter(
          (m) =>
            m.role !== 'OWNER' &&
            !currentContributorEmails.includes(m.user.email)
        ) ?? []

      await updateProject(project.id, {
        name: values.name,
        description: values.description,
      })

      await Promise.all([
        ...toAdd.map((email) => addProjectContributor(project.id, email)),
        ...toRemove.map((member) =>
          removeProjectContributor(project.id, member.user.id)
        ),
      ])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', project?.id] })
      toast.success(isEdit ? 'Projet modifié !' : 'Projet créé !')
      reset()
      setContributors([])
      onClose()
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || error?.message || 'Une erreur est survenue'
      toast.error(message)
      console.error('Project update error:', error)
    },
  })

  const onSubmit = (values) => mutation.mutate(values)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifier un projet' : 'Créer un projet'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label className={styles.fieldLabel}>
            Titre*
          </label>
          <input
            {...register('name')}
            placeholder={isEdit ? project?.name : ''}
            className={styles.input}
          />
          {errors.name && (
            <p className={styles.errorText}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Description*
          </label>
          <input
            {...register('description')}
            placeholder={isEdit ? project?.description : ''}
            className={styles.input}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Contributeurs
          </label>
          <ContributorSelect value={contributors} onChange={setContributors} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className={styles.submitBtn}
        >
          {isEdit ? 'Enregistrer' : 'Ajouter un projet'}
        </button>
      </form>
    </Modal>
  )
}