// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import {ResearchDomainOption} from './ResearchDomainFilter'
import {OrganisationOption} from './OrganisationFilter'
import {KeywordFilterOption} from './ProjectKeywordsFilter'
import ProjectFilters from './ProjectFilters'

type ProjectFiltersModalProps = {
  open: boolean,
  orderBy: string
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  domains: string[],
  domainsList: ResearchDomainOption[]
  organisations: string[]
  organisationsList: OrganisationOption[]
  filterCnt: number,
  setModal:(open:boolean)=>void
}

export default function SoftwareFiltersModal({
  open, keywords, keywordsList,
  domains, domainsList,
  organisations, organisationsList,
  filterCnt, orderBy,
  setModal
}:ProjectFiltersModalProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  return (
    <Dialog
      fullScreen={smallScreen}
      open={open}
      aria-labelledby="filters-panel"
      aria-describedby="filters-panel-responsive"
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        Filters
      </DialogTitle>
      <DialogContent>
        <div className="flex py-8 flex-col gap-8">
          <ProjectFilters
            filterCnt={filterCnt}
            orderBy={orderBy ?? ''}
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            domains={domains ?? []}
            domainsList={domainsList}
            organisations={organisations ?? []}
            organisationsList={organisationsList}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={()=>setModal(false)}
          color="secondary"
          sx={{marginRight:'2rem'}}
        >
          Cancel
        </Button>
        <Button
          onClick={()=>setModal(false)}
          color="primary"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
