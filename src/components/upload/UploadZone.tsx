import { useCallback, useState } from 'react'
import { Upload, Image, Video, X } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const LIMITS = {
  screenshot: { maxBytes: 10 * 1024 * 1024, accept: 'image/' },
  recording: { maxBytes: 500 * 1024 * 1024, accept: 'video/' },
}

interface UploadZoneProps {
  screenshot: string | null
  recording: string | null
  onScreenshotChange: (url: string | null) => void
  onRecordingChange: (url: string | null) => void
}

export function UploadZone({
  screenshot,
  recording,
  onScreenshotChange,
  onRecordingChange,
}: UploadZoneProps) {
  const { t } = useTranslation()
  const [dragOver, setDragOver] = useState<'screenshot' | 'recording' | null>(null)
  const [errors, setErrors] = useState<{ screenshot?: string; recording?: string }>({})

  const validateFile = useCallback(
    (file: File, type: 'screenshot' | 'recording'): string | null => {
      const limit = LIMITS[type]
      if (!file.type.startsWith(limit.accept)) {
        return t('upload.invalidFileType')
      }
      if (file.size > limit.maxBytes) {
        const maxMb = Math.round(limit.maxBytes / (1024 * 1024))
        return t('upload.fileTooLarge', { max: `${maxMb}MB` })
      }
      return null
    },
    [t],
  )

  const handleFile = useCallback(
    (file: File, type: 'screenshot' | 'recording') => {
      const error = validateFile(file, type)
      if (error) {
        setErrors((prev) => ({ ...prev, [type]: error }))
        return
      }
      setErrors((prev) => ({ ...prev, [type]: undefined }))
      const url = URL.createObjectURL(file)
      if (type === 'screenshot') onScreenshotChange(url)
      else onRecordingChange(url)
    },
    [validateFile, onScreenshotChange, onRecordingChange],
  )

  const onDrop = (e: React.DragEvent, type: 'screenshot' | 'recording') => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file, type)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <DropZone
        title={t('upload.screenshotTitle')}
        description={t('upload.screenshotDesc')}
        icon={<Image className="h-8 w-8" />}
        preview={screenshot}
        uploadedText={t('upload.uploaded', { name: t('upload.screenshotTitle') })}
        dragDropText={t('upload.dragDrop')}
        error={errors.screenshot}
        isDragOver={dragOver === 'screenshot'}
        onDragOver={(e) => { e.preventDefault(); setDragOver('screenshot') }}
        onDragLeave={() => setDragOver(null)}
        onDrop={(e) => onDrop(e, 'screenshot')}
        onFileSelect={(f) => handleFile(f, 'screenshot')}
        onClear={() => { onScreenshotChange(null); setErrors((p) => ({ ...p, screenshot: undefined })) }}
        accept="image/*"
      />
      <DropZone
        title={t('upload.recordingTitle')}
        description={t('upload.recordingDesc')}
        optionalBadge={t('upload.recordingOptional')}
        icon={<Video className="h-8 w-8" />}
        preview={recording}
        uploadedText={t('upload.uploaded', { name: t('upload.recordingTitle') })}
        dragDropText={t('upload.dragDrop')}
        error={errors.recording}
        isVideo
        isDragOver={dragOver === 'recording'}
        onDragOver={(e) => { e.preventDefault(); setDragOver('recording') }}
        onDragLeave={() => setDragOver(null)}
        onDrop={(e) => onDrop(e, 'recording')}
        onFileSelect={(f) => handleFile(f, 'recording')}
        onClear={() => { onRecordingChange(null); setErrors((p) => ({ ...p, recording: undefined })) }}
        accept="video/*"
      />
    </div>
  )
}

interface DropZoneProps {
  title: string
  description: string
  uploadedText: string
  dragDropText: string
  optionalBadge?: string
  error?: string
  icon: React.ReactNode
  preview: string | null
  isVideo?: boolean
  isDragOver: boolean
  accept: string
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (file: File) => void
  onClear: () => void
}

function DropZone({
  title,
  description,
  uploadedText,
  dragDropText,
  optionalBadge,
  error,
  icon,
  preview,
  isVideo,
  isDragOver,
  accept,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClear,
}: DropZoneProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all ${
        error
          ? 'border-red-300 bg-red-50/30'
          : isDragOver
            ? 'border-brand-500 bg-brand-50/50'
            : preview
              ? 'border-slate-200 bg-white'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {optionalBadge && !preview && (
        <span className="absolute top-3 right-3 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {optionalBadge}
        </span>
      )}
      {preview ? (
        <div className="relative p-4">
          {isVideo ? (
            <video src={preview} className="w-full h-48 object-cover rounded-xl" controls />
          ) : (
            <img src={preview} alt={title} className="w-full h-48 object-cover rounded-xl" />
          )}
          <button
            onClick={onClear}
            className="absolute top-6 right-6 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
          <p className="mt-3 text-sm font-medium text-slate-700 text-center">{uploadedText}</p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-10 cursor-pointer">
          <div className="text-slate-300 mb-4">{icon}</div>
          <p className="text-sm font-medium text-slate-700">{title}</p>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-brand-600 font-medium">
            <Upload className="h-3.5 w-3.5" />
            {dragDropText}
          </div>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFileSelect(file)
            }}
          />
        </label>
      )}
      {error && (
        <p className="px-4 pb-3 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
