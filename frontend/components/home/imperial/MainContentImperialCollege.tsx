// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/legacy/image'

import {HomeProps} from 'pages'
import CounterBox from './CounterBox'
import {useSession} from '~/auth'
import useImperialData from './useImperialData'
import ContentLoader from '~/components/layout/ContentLoader'
import MainContent from '~/components/layout/MainContent'

export default function MainContentImperialCollege({counts}: HomeProps) {
  const {token} = useSession()
  const {loading, organisations} = useImperialData(token)

  return (
    <MainContent>
      <div className="w-10/12 mx-auto p-5 md:p-10 grid lg:grid-cols-[1fr,1fr] gap-[2rem]">
        <div className="flex flex-col justify-left">
          <Image
            src="/images/imperial-college-logo.svg"
            width="361"
            height="85"
            layout="fixed"
            alt="Imperial College London logo"
            priority
          />

          <div className="mt-8 ml-4 text-lg max-w-prose">
            Some catchy and profound phrase about research software written at Imperial.
          </div>
        </div>
      <div className="relative">
      <div className="text-center">
      <h1>Other text</h1>
      </div>
        </div>
      </div>

      {/* COUNTERS SECTION EXAMPLE */}
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
        <CounterBox
          label="Open-Source Software"
          value={counts.open_software_cnt.toString()}
        />
        <CounterBox
          label="Closed-Source Software"
          value={(counts.software_cnt - counts.open_software_cnt).toString()}
        />
        <CounterBox
          label="Software Mentions"
          value={counts.software_mention_cnt.toString()}
        />
      </div>

    </MainContent>
  )
}
