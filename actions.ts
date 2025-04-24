// actions.js
import {DocumentActionComponent, DocumentActionProps} from 'sanity'

const publishWebhook = async (id: string) => {
  try {
    const response = await fetch(`${process.env.SANITY_STUDIO_WEBHOOK_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        published: true,
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`)
    }
    const data = await response.json()
    console.log('Webhook response:', data)
    return data
  } catch (error) {
    console.error('Error triggering webhook:', error)
    throw error
  }
}

export const StagingAction: DocumentActionComponent = (props: DocumentActionProps) => {
  return {
    label: 'Publish to Staging',
    onHandle: async () => {
      try {
        await publishWebhook(props.id)
        console.log('Published to staging successfully')
        // Optionally call props.onComplete() to signal completion
        props.onComplete?.()
      } catch (error) {
        console.error('Failed to publish to staging:', error)
        // Optionally show an error in the UI
      }
    },
  }
}
