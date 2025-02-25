// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {softwareOrderOptions} from '~/components/software/overview/filters/OrderSoftwareBy'
import useOrganisationContext from '../../context/useOrganisationContext'
import {OrderOption} from '~/components/filter/OrderBy'

const adminOrderOptions = [
  {key: 'status', label: 'Blocked', direction: 'asc.nullslast'},
  {key: 'is_published', label: 'Not published', direction: 'asc.nullslast'},
]

export function getSoftwareOrderOptions(isMaintainer:boolean) {
  if (isMaintainer) {
    const order = [
      ...softwareOrderOptions,
      // additional organisation option (should be default)
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOrderOptions
    ]
    return order
  } else {
    return [
      ...softwareOrderOptions,
      // additional organisation option (should be default)
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'}
    ]
  }
}

export default function useSoftwareOrderOptions() {
  const {isMaintainer} = useOrganisationContext()
  const [softwareOrder,setSoftwareOrder] = useState<OrderOption[]>([])

  useEffect(() => {
    const order = getSoftwareOrderOptions(isMaintainer)
    setSoftwareOrder(order)
  }, [isMaintainer])

  return softwareOrder

}
