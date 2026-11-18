// The Step 4 handout, with its four TODOs filled in
import '@esri/calcite-components/components/calcite-select'
import '@esri/calcite-components/components/calcite-option'
import '@esri/calcite-components/components/calcite-button'
import '@esri/calcite-components/components/calcite-notice'
import Graphic from '@arcgis/core/Graphic'
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { useState } from 'react'
import { EDIT_FIELD } from '../config'

type StatusFormProps = {
  feature: Graphic
  layer: FeatureLayer
  onSaved: () => void
}

export function StatusForm({ feature, layer, onSaved }: StatusFormProps) {
  // Provided: the value as it was when the request was clicked
  const saved = String(feature.attributes[EDIT_FIELD] ?? '')

  // TODO 1: what the user has picked, and not yet saved, is React's
  const [draft, setDraft] = useState(saved)

  // Provided: where the save is up to
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'failed'>('idle')

  // TODO 2: the choices come from the layer, not from a list typed into our code
  const domain = layer.getFieldDomain(EDIT_FIELD)
  const choices = domain?.type === 'coded-value' ? domain.codedValues : []

  async function save() {
    // Provided: the dropdown hands back text. Find the choice it stands for, so a number is saved as a number.
    const code = choices.find((choice) => String(choice.code) === draft)?.code ?? draft

    setSaveState('saving')
    try {
      // TODO 3: the edit is a new Graphic with two things in it: which request, and what changed
      const edit = new Graphic({
        attributes: { [layer.objectIdField]: feature.getObjectId(), [EDIT_FIELD]: code },
      })
      const result = await layer.applyEdits({ updateFeatures: [edit] })

      // TODO 4: a save can fail without throwing, so check the result
      const error = result.updateFeatureResults[0]?.error
      if (error) {
        setSaveState('failed')
      } else {
        onSaved()
      }
    } catch {
      setSaveState('failed')
    }
  }

  return (
    <div className="status-form">
      <calcite-select label="Status" value={draft} oncalciteSelectChange={(event) => setDraft(event.target.value)}>
        {choices.map((choice) => (
          <calcite-option key={choice.code} value={String(choice.code)}>
            {choice.name}
          </calcite-option>
        ))}
      </calcite-select>

      <calcite-button loading={saveState === 'saving'} disabled={saveState === 'saving' || draft === saved} onClick={save}>
        Save
      </calcite-button>

      {saveState === 'failed' && (
        <calcite-notice open kind="danger">
          <div slot="message">Not saved. Your change is still in the form.</div>
        </calcite-notice>
      )}
    </div>
  )
}
