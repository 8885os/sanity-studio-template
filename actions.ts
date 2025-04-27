// actions.js
import axios from 'axios'
import {DocumentActionProps, useDocumentOperation} from 'sanity'
import {UploadIcon} from '@sanity/icons'
import {useEffect, useState} from 'react'
const PRODUCTION_WEBHOOK = process.env.SANITY_STUDIO_PRODUCTION_WEBHOOK
const WEBHOOK_SECRET = process.env.SANITY_STUDIO_WEBHOOK_SECRET_PRODUCTION

const handleDeploy = async () => {
  try {
    await axios.post(`${PRODUCTION_WEBHOOK}`, {
      secret: WEBHOOK_SECRET, // or the secret you want to use
      isManual: true, // Indicates that this is a manual revalidation request
    })
    await new Promise((resolve) => setTimeout(resolve, 5000))
  } catch (error) {
    console.error('Error revalidating:', error)
    alert('Failed to Update.')
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
