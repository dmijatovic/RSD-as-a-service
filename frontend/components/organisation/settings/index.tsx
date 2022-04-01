import {useEffect} from 'react'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'

import {useForm} from 'react-hook-form'

import {Session} from '../../../auth'
import useSnackbar from '../../snackbar/useSnackbar'
import ControlledTextField from '../../form/ControlledTextField'
import {OrganisationForOverview} from '../../../types/Organisation'
import {EditOrganisation} from '../../../types/Organisation'
import {updateOrganisation} from '../../../utils/editOrganisation'
import {organisationInformation as config} from '../organisationConfig'

export default function OrganisationSettings({organisation, session}:
  {organisation: OrganisationForOverview,session:Session}) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {handleSubmit, watch, formState, reset, control, register} = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })
  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  useEffect(() => {
    if (organisation) {
      reset(organisation)
    }
  }, [organisation, reset])

  function isSaveDisabled() {
    // if pos is undefined we are creating
    // new entry, but we might already have required
    // information (first name - last name). In this
    // case we only check if form is valid
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }

  async function onSubmit(data: EditOrganisation) {
    // console.log('submit...', data)
    if (data && data.id) {
      const resp = await updateOrganisation({
        item: data,
        token: session.token
      })
      // debugger
      if (resp.status === 200) {
        showSuccessMessage(`Saved ${data.name} settings.`)
        reset(data)
      } else {
        showErrorMessage(`Failed to save. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to save. Organisation UUID is missing.')
    }
  }

  return (
    // <section>
    <form onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id')}
      />
      <input type="hidden"
        {...register('parent')}
      />
      <section className="flex justify-between align-center">
        <h2>Settings</h2>
        <Button
          type="submit"
          variant="contained"
          sx={{
            // overwrite tailwind preflight.css for submit type
            '&[type="submit"]:not(.Mui-disabled)': {
              backgroundColor:'primary.main'
            }
          }}
          endIcon={
            <SaveIcon />
          }
          disabled={isSaveDisabled()}
        >
          Save
        </Button>
      </section>
      <div className="flex pt-8"></div>
      <section className="grid grid-cols-[1fr,1fr] gap-8">
        <ControlledTextField
            control={control}
            options={{
              name: 'name',
              // variant: 'outlined',
              label: config.name.label,
              useNull: true,
              defaultValue: formData?.name,
              helperTextMessage: config.name.help,
              helperTextCnt: `${formData?.name?.length || 0}/${config.name.validation.maxLength.value}`,
            }}
            rules={config.name.validation}
          />
        <ControlledTextField
          control={control}
          options={{
            name: 'ror_id',
            label: config.ror_id.label,
            useNull: true,
            defaultValue: formData?.ror_id,
            helperTextMessage: config.ror_id.help,
            helperTextCnt: `${formData?.ror_id?.length || 0}/${config.ror_id.validation.maxLength.value}`,
          }}
          rules={config.ror_id.validation}
        />
      </section>
      <div className="py-4"></div>
      <ControlledTextField
        control={control}
        options={{
          name: 'website',
          // variant: 'outlined',
          label: config.website.label,
          useNull: true,
          defaultValue: formData?.website,
          helperTextMessage: config.website.help,
          helperTextCnt: `${formData?.website?.length || 0}/${config.website.validation.maxLength.value}`,
        }}
        rules={config.website.validation}
      />
    </form>
    // </section>
  )
}
