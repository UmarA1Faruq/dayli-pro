import { TriangleAlert } from 'lucide-react'
import Modal from './Modal'
import { cn } from '../utils/helpers'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Hapus item ini?',
  description = 'Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Ya, hapus',
  cancelLabel = 'Batal',
  tone = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      level={2}
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn('flex-1', tone === 'danger' ? 'btn-danger' : 'btn-primary')}
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center px-2 pb-1 text-center">
        <span
          className={cn(
            'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl',
            tone === 'danger'
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-accent/10 text-accent',
          )}
        >
          <TriangleAlert className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </Modal>
  )
}
