import {defineType, defineField} from '@sanity/types'

export default defineType({
  name: 'postListBlock',
  title: 'Post List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: 'Post List Block',
        subtitle: 'Displays all posts',
      }
    },
  },
})
