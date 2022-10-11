// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import {CodePlatform} from '~/types/SoftwareTypes'
import {softwareInformation as config} from '../editSoftwareConfig'

type AutosaveRepositoryPlatformProps = {
  value: CodePlatform | null
  disabled: boolean
  helperText: string
  onChange: (selected:string)=>void
}

export default function AutosaveRepositoryPlatform({value, disabled,
  helperText, onChange}: AutosaveRepositoryPlatformProps) {

  const {label, options} = config.repository_platform

  // console.group('AutosaveRepositoryPlatform')
  // console.log('value...', value)
  // console.log('disabled...', disabled)
  // console.log('helperText...',helperText)
  // console.groupEnd()

  return (
    <FormControl variant="standard"
      sx={{
        m: 1,
        width: '7rem'
      }}
    >
      <InputLabel id={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        id={`select-${label}`}
        label={label}
        variant='standard'
        value={value ?? ''}
        onChange={({target}:{target:any})=>onChange(target.value)}
        disabled={disabled}
      >
        {options.map(item => {
          return (
            <MenuItem
              key={item.value}
              value={item.value}>
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}
