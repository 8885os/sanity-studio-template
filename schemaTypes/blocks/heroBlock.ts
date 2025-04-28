import {defineType, defineField} from '@sanity/types'

export default defineType({
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      block: 'heroBlock',
      title: 'heading',
      subtitle: 'subheading',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: `Hero Block - ${title}` || 'Untitled Hero Block',
        media: media,
      }
    },
  },
})
