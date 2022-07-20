// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export const addConfig = {
  page_title:'Add public page',
  addInfo: `
  Please provide title and slug of new public page.
  `,
  title: {
    label: 'Title (link label)',
    help: 'Title used in the link.',
    validation: {
      required: 'Title is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  slug: {
    label: 'The url of this page will be',
    help: 'You can change slug. Use letters, numbers and dash "-". Other characters are not allowed.',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'}
    }
  }
}

