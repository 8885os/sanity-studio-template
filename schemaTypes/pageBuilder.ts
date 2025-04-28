import {defineType, defineField} from '@sanity/types'

export const pageBuilder = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        {type: 'heroBlock'},
        {type: 'textBlock'},
        {type: 'imageBlock'},
        {type: 'postListBlock'},
        // Add more block types as needed
      ],
    }),
  ],
})
