import caseStudyList from './blocks/caseStudyList'
import heroBlock from './blocks/heroBlock'
import imageBlock from './blocks/imageBlock'
import textBlock from './blocks/textBlock'
import {pageBuilder} from './pageBuilder'
import {postType} from './caseStudies'

export const schemaTypes = [pageBuilder, postType, heroBlock, textBlock, imageBlock, caseStudyList]
