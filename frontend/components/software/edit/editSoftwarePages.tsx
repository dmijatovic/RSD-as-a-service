// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ContentLoader from '~/components/layout/ContentLoader'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'

// use dynamic imports instead
const SoftwareContributors = dynamic(() => import('./contributors'),{
  loading: ()=><ContentLoader />
})
const SoftwareInformation = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const SoftwareMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})
const SoftwareMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const SoftwareOgranisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const PackageManagers = dynamic(() => import('./package-managers'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const SoftwareTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})
const SoftwareServices = dynamic(() => import('./services'),{
  loading: ()=><ContentLoader />
})


export type EditSoftwarePageProps = {
  id: string
  status: string,
  label: string,
  icon: JSX.Element,
  render: () => JSX.Element
}

export const editSoftwarePage:EditSoftwarePageProps[] = [{
  id: 'information',
  label: 'Software details',
  icon: <AppShortcutIcon />,
  render: () => <SoftwareInformation />,
  status: ''
},{
  id: 'contributors',
  label: 'Contributors',
  icon: <GroupIcon />,
  render: () => <SoftwareContributors />,
  status: ''
},{
  id: 'organisations',
  label: 'Organisations',
  icon: <BusinessIcon />,
  render: () => <SoftwareOgranisations />,
  status: ''
},{
  id: 'mentions',
  label: 'Mentions',
  icon: <AddCommentIcon />,
  render: () => <SoftwareMentions />,
  status: ''
},{
  id: 'testimonials',
  label: 'Testimonials',
  icon: <ThreePIcon />,
  render: () => <SoftwareTestimonials />,
  status: ''
},{
  id: 'package-managers',
  label: 'Package managers',
  icon: <HomeRepairServiceIcon />,
  render: () => <PackageManagers />,
  status: ''
},{
  id: 'related-software',
  label: 'Related software',
  icon: <JoinInnerIcon />,
  render: () => <RelatedSoftware />,
  status: ''
},{
  id: 'related-projects',
  label: 'Related projects',
  icon: <DonutLargeIcon />,
  render: () => <RelatedProjects />,
  status: ''
},{
  id: 'maintainers',
  label: 'Maintainers',
  icon: <PersonAddIcon />,
  render: () => <SoftwareMaintainers />,
  status: ''
},{
  id: 'services',
  label: 'Background services',
  icon: <MiscellaneousServicesIcon />,
  render: () => <SoftwareServices />,
  status: ''
}
]
