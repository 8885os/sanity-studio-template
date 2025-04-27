import React, {useEffect, useState} from 'react'
import axios, {AxiosRequestConfig} from 'axios'
import './deploytool.css'

const VERCEL_API_URL = 'https://api.vercel.com/v6/deployments'
const productionURL = 'https://wdc-test-gamma.vercel.app/'
const stagingURL = 'https://wdc-test-git-staging-8885os-projects.vercel.app/'
const PROJECT_ID = 'prj_Z1v7HI0owi0iMGrUjdHgTiSen5He'
const TOKEN = process.env.SANITY_STUDIO_VERCEL_TOKEN
const PRODUCTION_WEBHOOK = process.env.SANITY_STUDIO_PRODUCTION_WEBHOOK
const WEBHOOK_SECRET = process.env.SANITY_STUDIO_WEBHOOK_SECRET_PRODUCTION

interface Deployment {
  id: string
  createdAt: string
  url: string
  target: string
  readyState: string
}

export default function CustomDeployTool() {
  const [stagingStatus, setStagingStatus] = useState<string>('Loading...')
  const [productionStatus, setproductionStatus] = useState<string>('Loading...')
  const [error, setError] = useState<string | null>(null)
  const [deployments, setDeployments] = useState<{
    staging: Deployment | null
    production: Deployment | null
  }>({staging: null, production: null})
  const [confirming, setConfirming] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [updating, setUpdating] = useState(false)

  const fetchDeployments = async () => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }

      const response = await axios.get(`${VERCEL_API_URL}?projectId=${PROJECT_ID}&limit=10`, config)

      const deploymentsData = response.data.deployments

      const latestDeployment = deploymentsData.find(
        (deployment: Deployment) => deployment.target === 'production',
      )

      const stagingDeployment = deploymentsData.find(
        (deployment: Deployment) => deployment.target !== 'production',
      )

      setDeployments({staging: stagingDeployment, production: latestDeployment})
    } catch (err) {
      setError('Error fetching deployments.')
      console.error('Deployment fetch error:', err)
    }
  }

  // Trigger deployment on button click
  const handleDeploy = async () => {
    try {
      setUpdating(true)
      setConfirming(false)
      const response = await axios.post(`${PRODUCTION_WEBHOOK}`, {
        secret: WEBHOOK_SECRET, // or the secret you want to use
        isManual: true, // Indicates that this is a manual revalidation request
      })
      await new Promise((resolve) => setTimeout(resolve, 5000))

      if (response.status === 200) {
        setUpdating(false)
        setUpdated(true)
        await new Promise((resolve) => setTimeout(resolve, 5000))
        setUpdated(false)
      }
    } catch (error) {
      console.error('Error revalidating:', error)
      alert('Failed to Update.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'green'
      case 'queued':
      case 'initializing':
        return 'yellow'
      case 'building':
        return 'orange'
      case 'canceled':
      case 'error':
        return 'red'
      default:
        return 'gray'
    }
  }

  // Fetch deployments when component mounts
  useEffect(() => {
    fetchDeployments()
    setStagingStatus(deployments.staging?.readyState || 'Unknown')
    setproductionStatus(deployments.production?.readyState || 'Loading...')
    // Set an interval to refresh deployments every 30 seconds
    const interval = setInterval(fetchDeployments, 30000)

    return () => clearInterval(interval) // Clear interval on unmount
  }, [deployments.production?.readyState, deployments.staging?.readyState])

  useEffect(() => {
    setStagingStatus(deployments.staging?.readyState || 'Unknown')
    setproductionStatus(deployments.production?.readyState || 'Loading...')
  }, [deployments]) // Re-run when deployments state changes

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          width: '90%',
          margin: '1rem',
        }}
      >
        <h3 style={{marginBottom: '1rem'}}>Vercel Deployments</h3>

        {error && (
          <div style={{color: 'red', marginBottom: '1rem'}}>
            <p>{error}</p>
          </div>
        )}

        <div style={{marginBottom: '2rem'}}>
          <p>
            Preview:{' '}
            <span
              style={{
                color: getStatusColor(stagingStatus),
                border: '1px solid #ccc',
                padding: '4px 8px',
                borderRadius: '8px',
                maxWidth: '600px',
              }}
            >
              {stagingStatus}
            </span>{' '}
            <a href={stagingURL} target="_blank" rel="noreferrer">
              Preview URL
            </a>
          </p>
          <p style={{marginBottom: '2rem'}}>
            Last Deployment at:{' '}
            {deployments.staging
              ? new Date(deployments.staging.createdAt).toLocaleString()
              : 'Unknown'}
          </p>
          <button
            onClick={() => {
              if (!confirming) {
                setConfirming(true)
              } else {
                handleDeploy()
              }
            }}
            style={{
              padding: '8px 12px',
              fontSize: '1.1rem',
              backgroundColor: 'transparent',
              color: '#32a852',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            {confirming ? 'Click again to confirm' : 'Publish live'}
          </button>

          <p>{updating && <span style={{color: 'green'}}>Updating...</span>}</p>
          <p>{updated && <span style={{color: 'green'}}>Updated successfully</span>}</p>

          <p>
            Production:{' '}
            <span
              style={{
                color: getStatusColor(productionStatus),
                border: '1px solid #ccc',
                padding: '4px 8px',
                borderRadius: '8px',
                maxWidth: '600px',
              }}
            >
              {productionStatus}
            </span>{' '}
            <a href={productionURL} target="_blank" rel="noreferrer">
              Production URL
            </a>
          </p>
          <p>
            Last Deployment at:{' '}
            {deployments.production
              ? new Date(deployments.production.createdAt).toLocaleString()
              : 'Unknown'}
          </p>

          <p>
            Latest deployment:{' '}
            {deployments.staging &&
            deployments.production &&
            // If production is newer than staging
            (new Date(deployments.production.createdAt).getTime() >
              new Date(deployments.staging.createdAt).getTime() ||
              // If production and staging were published at the same time (within 5 seconds)
              Math.abs(
                new Date(deployments.production.createdAt).getTime() -
                  new Date(deployments.staging.createdAt).getTime(),
              ) /
                1000 <=
                5)
              ? 'Production'
              : 'Staging'}
          </p>
        </div>
      </div>
    </div>
  )
}
