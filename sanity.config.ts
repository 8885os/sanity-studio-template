import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import CustomDeployTool from './components/DeployTool'

export default defineConfig({
  name: 'default',
  title: 'New Project',

  projectId: `${process.env.SANITY_STUDIO_PROJECT_ID}`,
  dataset: `${process.env.SANITY_STUDIO_DATASET}`,

  plugins: [structureTool({title: 'CMS'}), visionTool({title: 'Developer Tab'})],

  schema: {
    types: schemaTypes,
  },
  tools: (prev) => [
    ...prev,
    {
      name: 'deploy',
      title: 'Deploy',
      component: CustomDeployTool,
    },
  ],
})
