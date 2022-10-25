// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import AddNewItemInfo from '~/components/software/edit/mentions/AddNewItemInfo'
import {newMentionItem} from '~/utils/editMentions'
import {cfgOutput as config} from './config'

export default function AddOutput() {
  const {setEditModal} = useEditMentionReducer()

  function onNewOutput() {
    const item = newMentionItem()
    setEditModal(item)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <EditSectionTitle
            title={config.newItem.title}
            subtitle={config.newItem.subtitle}
          />
        </div>
        <div className="px-4"></div>
        <Button
          onClick={onNewOutput}>
          add
        </Button>
      </div>
      <AddNewItemInfo />
    </>
  )
}
