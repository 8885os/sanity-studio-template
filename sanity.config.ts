import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import CustomDeployTool from './components/DeployTool'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {StagingAction} from './actions'

export default defineConfig({
  name: 'default',
  title: 'New Project',

  projectId: `${process.env.SANITY_STUDIO_PROJECT_ID}`,
  dataset: `${process.env.SANITY_STUDIO_DATASET}`,

  plugins: [
    structureTool({title: 'CMS'}),
    visionTool({title: 'Developer Tab'}),
    presentationTool({
      resolve: {
        locations: {
          post: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [{title: 'Posts', href: `/case-studies`}],
            }),
          }),
        },
      },
      previewUrl: {
        origin: 'http://localhost:3000/',
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
  ],
  document: {
    actions: [StagingAction],
  },

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
