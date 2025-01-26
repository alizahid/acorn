import { decode } from 'entities'
import { compact } from 'lodash'

import {
  type SubmissionCommunitySchema,
  type SubmissionFlairSchema,
  type SubmissionRequirementsSchema,
} from '~/schemas/submission'
import { type Submission } from '~/types/submission'

import { transformFlair } from './flair'

type Props = {
  community: SubmissionCommunitySchema
  flair: SubmissionFlairSchema
  requirements: SubmissionRequirementsSchema
}

export function transformSubmission({
  community,
  flair,
  requirements,
}: Props): Submission {
  return {
    community: {
      id: community.data.name,
      image: community.data.community_icon
        ? decode(community.data.community_icon) || undefined
        : community.data.icon_img
          ? decode(community.data.icon_img) || undefined
          : undefined,
      name: community.data.display_name,
    },
    flair: compact(
      flair.map((item) => {
        if (item.type === 'richtext') {
          return {
            background: item.background_color,
            color: item.text_color,
            flair: transformFlair(item.richtext),
            id: item.id,
            type: 'richtext',
          }
        }

        if (!item.text) {
          return null
        }

        return {
          background: item.background_color,
          color: item.text_color,
          id: item.id,
          text: item.text,
          type: 'text',
        }
      }),
    ),
    media: {
      gallery: community.data.allow_galleries,
      image: community.data.allow_images,
      link: ['any', 'link'].includes(community.data.submission_type),
      spoiler: community.data.spoilers_enabled,
      text: ['any', self].includes(community.data.submission_type),
      video: community.data.allow_videos,
    },
    rules: {
      bodyMaxLength: requirements.body_text_max_length ?? undefined,
      bodyMinLength: requirements.body_text_min_length ?? undefined,
      domainsBlacklist: requirements.domain_blacklist,
      domainsWhitelist: requirements.domain_whitelist,
      flairRequired: requirements.is_flair_required,
      mediaMaxCount: requirements.gallery_max_items ?? undefined,
      mediaMinCount: requirements.gallery_min_items ?? undefined,
      titleMaxLength: requirements.title_text_max_length ?? undefined,
      titleMinLength: requirements.title_text_min_length ?? undefined,
    },
  }
}
