// Handout for Step 4 of the Day 4 lab. The form's JSX is in place: fill in the four TODOs.
// This file has red underlines until all four are done. Nothing uses it before Step 4, so the app still runs.
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

  // TODO 1: Keep the draft in state. It starts as `saved`.

  // Provided: where the save is up to
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'failed'>('idle')

  // TODO 2: Ask the layer for the field's list of allowed values.
  // `choices` is that list when there is one, and an empty list when there isn't.

  async function save() {
    // Provided: the dropdown hands back text. Find the choice it stands for, so a number is saved as a number.
    const code = choices.find((choice) => String(choice.code) === draft)?.code ?? draft

    setSaveState('saving')
    try {
      // TODO 3: Build the edit: which request, and what changed. Then send it, and wait for the result.
      // TODO 4: Check the result. If it holds an error, the save failed. If not, call onSaved().
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
