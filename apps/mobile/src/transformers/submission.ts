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
      body: {
        blacklist: requirements.body_blacklisted_strings,
        max: requirements.body_text_max_length ?? undefined,
        min: requirements.body_text_min_length ?? undefined,
        required: requirements.body_required_strings,
      },
      domains: {
        blacklist: requirements.domain_blacklist,
        whitelist: requirements.domain_whitelist,
      },
      flair: {
        required: requirements.is_flair_required,
      },
      media: {
        max: requirements.gallery_max_items ?? undefined,
        min: requirements.gallery_min_items ?? undefined,
      },
      title: {
        blacklist: requirements.title_blacklisted_strings,
        max: requirements.title_text_max_length ?? undefined,
        min: requirements.title_text_min_length ?? undefined,
        required: requirements.title_required_strings,
      },
    },
  }
}
