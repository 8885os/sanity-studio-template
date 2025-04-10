import React, {useEffect, useState} from 'react'
import axios, {AxiosRequestConfig} from 'axios'

const VERCEL_API_URL = 'https://api.vercel.com/v9/projects/'
const previewURL = 'https://wdc-test-g3s0jog8w-8885os-projects.vercel.app/'
const productionURL = 'https://wdc-test-gamma.vercel.app/'
const PROJECT_ID = 'prj_Z1v7HI0owi0iMGrUjdHgTiSen5He'
const TOKEN = process.env.SANITY_STUDIO_VERCEL_TOKEN

interface Deployment {
  id: string
  status: string
  createdAt: string
}

export default function CustomDeployTool() {
  const [status, setStatus] = useState<string>('Loading...')
  const [error, setError] = useState<string | null>(null)
  const [deployment, setDeployment] = useState<Deployment | null>(null)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'green'
      case 'queued':
        return 'yellow'
      case 'initializing':
        return 'yellow'
      case 'building':
        return 'orange'
      case 'canceled':
        return 'red'
      case 'error':
        return 'red'
      default:
        return 'gray'
    }
  }
  useEffect(() => {
    const fetchBuildStatus = async () => {
      try {
        // Define the config object with proper typing
        const config: AxiosRequestConfig = {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }

        const response = await axios.get(`${VERCEL_API_URL}${PROJECT_ID}`, config)

        const deploymentsData = response.data.latestDeployments || []
        setDeployment(deploymentsData[0])

        const latestDeployment = deploymentsData[0]
        const buildStatus = latestDeployment?.readyState || 'Unknown'
        setStatus(buildStatus)
      } catch (err) {
        setError('Error fetching deployments.')
        console.error('Deployment fetch error:', err)
      }
    }

    fetchBuildStatus()
    const interval = setInterval(fetchBuildStatus, 30000)
    return () => clearInterval(interval)
  }, [])

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

        {error ? (
          <div style={{color: 'red', marginBottom: '1rem'}}>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{marginBottom: '1rem'}}>
            <p className="mb-10">
              Preview:{' '}
              <span
                style={{
                  color: getStatusColor(status),
                  border: '1px solid #ccc',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  maxWidth: '600px',
                }}
              >
                {status}
              </span>{' '}
              <a
                href={previewURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: '#0066cc'}}
              >
                Preview URL
              </a>
            </p>
            <p>
              Last Deployment at:{' '}
              {deployment ? new Date(deployment.createdAt).toLocaleString() : 'Unknown'}
            </p>
          </div>
        )}

        <div style={{marginBottom: '2rem', fontSize: '0.9rem', color: '#666'}}>
          After updating the CMS in the structure tab, use Preview to verify changes, then deploy to
          Production to go live.
        </div>

        <div>
          <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>🔗 Deployment Links</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{margin: '0.5rem 0'}}>
              🔍{' '}
              <a
                href={previewURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: '#0066cc'}}
              >
                Preview URL
              </a>
            </li>
            <li style={{margin: '0.5rem 0'}}>
              🚀{' '}
              <a
                href={productionURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: '#0066cc'}}
              >
                Production URL
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
