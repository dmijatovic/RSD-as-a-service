// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ContentContainer from '~/components/layout/ContentContainer'
import {HighlightsCarousel} from './highlights/HighlightsCarousel'
import {SoftwareHighlight} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import useRsdSettings from '~/config/useRsdSettings'
import {useRouter} from 'next/router'

export default function SoftwareHighlights({highlights}: { highlights: SoftwareHighlight[] }) {
  // console.group('SoftwareHighlights')
  // console.log('loading...', loading)
  // console.log('highlights...', highlights)
  // console.groupEnd()
  const {host} = useRsdSettings()
  const router = useRouter()

  // if there are no hightlights we do not show this section
  if (highlights.length===0) return null

  // show carousel only on first page
  if (typeof router.query.page === 'string' && parseInt(router.query.page) > 1) return null

  return (
    <div className="mt-8">
      <ContentContainer>
        <div
          className="text-3xl"
        >
          {host.software_highlights_title}
        </div>
      </ContentContainer>
      <HighlightsCarousel items={highlights} />
    </div>
  )
}
