import type { CanvasElement } from '../../types'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Slider } from '../ui/Slider'
import { Select } from '../ui/Select'
import { BRAND_COLORS } from '../../utils/colors'
import { Settings2, Type, Palette } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

interface PropertyPanelProps {
  selectedElement: CanvasElement | null
  content: import('../../types').AssetContent
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
  onUpdateContent: (partial: Partial<import('../../types').AssetContent>) => void
}

export function PropertyPanel({
  selectedElement,
  content,
  onUpdateElement,
  onUpdateContent,
}: PropertyPanelProps) {
  const { t } = useTranslation()

  if (!selectedElement) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="px-4 py-4 border-b border-slate-200">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Settings2 className="h-3.5 w-3.5" />
            {t('properties.title')}
          </h2>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-500">{t('workspace.selectElement')}</p>
          <GlobalContentEditor content={content} onUpdate={onUpdateContent} />
        </div>
      </aside>
    )
  }

  const updateStyle = (key: string, value: string | number) => {
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, [key]: value },
    })
  }

  const updateContent = (value: string) => {
    if (selectedElement.type === 'text') {
      onUpdateElement(selectedElement.id, { content: value })
    } else if (selectedElement.type === 'image') {
      onUpdateElement(selectedElement.id, { src: value })
    }
    if (selectedElement.fieldKey) {
      onUpdateContent({ [selectedElement.fieldKey]: value } as Partial<typeof content>)
    }
  }

  const elementTypeLabel =
    selectedElement.type === 'text'
      ? t('properties.text')
      : selectedElement.type === 'image'
        ? t('properties.image')
        : t('properties.element')

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="px-4 py-4 border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Settings2 className="h-3.5 w-3.5" />
          {elementTypeLabel}
        </h2>
        <p className="text-xs text-slate-400 mt-1 capitalize">{selectedElement.id.replace(/-/g, ' ')}</p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {(selectedElement.type === 'text' || selectedElement.type === 'image') && (
          <div>
            {selectedElement.type === 'text' ? (
              <Textarea
                label={t('properties.content')}
                value={selectedElement.content ?? ''}
                onChange={(e) => updateContent(e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                label={t('properties.imageUrl')}
                value={selectedElement.src ?? ''}
                onChange={(e) => updateContent(e.target.value)}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="X"
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => onUpdateElement(selectedElement.id, { x: Number(e.target.value) })}
          />
          <Input
            label="Y"
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => onUpdateElement(selectedElement.id, { y: Number(e.target.value) })}
          />
          <Input
            label={t('properties.width')}
            type="number"
            value={Math.round(selectedElement.width)}
            onChange={(e) => onUpdateElement(selectedElement.id, { width: Number(e.target.value) })}
          />
          <Input
            label={t('properties.height')}
            type="number"
            value={Math.round(selectedElement.height)}
            onChange={(e) => onUpdateElement(selectedElement.id, { height: Number(e.target.value) })}
          />
        </div>

        {selectedElement.type === 'text' && (
          <>
            <Slider
              label={t('properties.fontSize')}
              value={selectedElement.style?.fontSize ?? 16}
              min={10}
              max={72}
              onChange={(v) => updateStyle('fontSize', v)}
              formatValue={(v) => `${v}px`}
            />
            <Select
              label={t('properties.fontWeight')}
              value={String(selectedElement.style?.fontWeight ?? 400)}
              options={[
                { value: '400', label: t('properties.weight.regular') },
                { value: '500', label: t('properties.weight.medium') },
                { value: '600', label: t('properties.weight.semibold') },
                { value: '700', label: t('properties.weight.bold') },
                { value: '800', label: t('properties.weight.extraBold') },
              ]}
              onChange={(v) => updateStyle('fontWeight', Number(v))}
            />
            <Select
              label={t('properties.textAlign')}
              value={selectedElement.style?.textAlign ?? 'left'}
              options={[
                { value: 'left', label: t('properties.align.left') },
                { value: 'center', label: t('properties.align.center') },
                { value: 'right', label: t('properties.align.right') },
              ]}
              onChange={(v) => updateStyle('textAlign', v)}
            />
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Palette className="h-3 w-3" /> {t('properties.color')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateStyle('color', color)}
                    className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${
                      selectedElement.style?.color === color ? 'border-brand-600 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {selectedElement.type === 'image' && (
          <Slider
            label={t('properties.borderRadius')}
            value={selectedElement.style?.borderRadius ?? 0}
            min={0}
            max={100}
            onChange={(v) => updateStyle('borderRadius', v)}
            formatValue={(v) => `${v}px`}
          />
        )}

        <Slider
          label={t('properties.opacity')}
          value={(selectedElement.style?.opacity ?? 1) * 100}
          min={10}
          max={100}
          onChange={(v) => updateStyle('opacity', v / 100)}
          formatValue={(v) => `${v}%`}
        />
      </div>
    </aside>
  )
}

function GlobalContentEditor({
  content,
  onUpdate,
}: {
  content: import('../../types').AssetContent
  onUpdate: (partial: Partial<import('../../types').AssetContent>) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3 pt-2 border-t border-slate-100">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        <Type className="h-3 w-3" /> {t('properties.globalContent')}
      </h3>
      <Input label={t('properties.courseName')} value={content.courseName} onChange={(e) => onUpdate({ courseName: e.target.value })} />
      <Input label={t('properties.teacherName')} value={content.teacherName} onChange={(e) => onUpdate({ teacherName: e.target.value })} />
      <Input label={t('properties.headline')} value={content.headline} onChange={(e) => onUpdate({ headline: e.target.value })} />
      <Input label={t('properties.cta')} value={content.cta} onChange={(e) => onUpdate({ cta: e.target.value })} />
      <Input label={t('properties.price')} value={content.price} onChange={(e) => onUpdate({ price: e.target.value })} />
      <Textarea label={t('properties.courseIntro')} value={content.courseIntroduction} onChange={(e) => onUpdate({ courseIntroduction: e.target.value })} rows={2} />
      <Input
        label={t('properties.screenshotUrl')}
        value={content.classroomScreenshot}
        onChange={(e) => onUpdate({ classroomScreenshot: e.target.value })}
      />
    </div>
  )
}
