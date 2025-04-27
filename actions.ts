// actions.js
import axios from 'axios'
import {DocumentActionComponent, DocumentActionProps, useDocumentOperation} from 'sanity'
import {UploadIcon} from '@sanity/icons'
import {useEffect, useState} from 'react'
const PRODUCTION_WEBHOOK = process.env.SANITY_STUDIO_VERCEL_WEBHOOK
const handleDeploy = async () => {
  try {
    await axios.post(`${PRODUCTION_WEBHOOK}`)
  } catch (err) {
    console.error('Deploy Error:', err)
  }
}

export const ProductionAction = (props: DocumentActionProps) => {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)
  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, props.draft])
  return {
    label: 'Publish Live',
    onHandle: async () => {
      setIsPublishing(true)
      patch.execute([{set: {publishedAt: new Date().toISOString()}}])
      publish.execute()
      props.onComplete()

      try {
        await handleDeploy()
      } catch (error) {
        console.error('Failed to publish to staging:', error)
        // Optionally show an error in the UI
      }
    },
    icon: UploadIcon,
    tone: 'positive',
  }
}

export function createImprovedAction(originalPublishAction: any) {
  const StagingAction = (props: DocumentActionProps) => {
    const originalResult = originalPublishAction(props)

    return {
      ...originalResult,
      label: 'Publish to Staging',
      tone: 'caution',
    }
  }
  return StagingAction
}
