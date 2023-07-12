// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * IMPERIAL OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getAuthorisationEndpoint, RedirectToProps, claims, getRedirectUrl} from '~/auth/api/authHelpers'
import logger from '~/utils/logger'
import {Provider, ApiError} from '.'

type Data = Provider | ApiError

export async function imperialRedirectProps() {
  // extract wellknow url from env
  const wellknownUrl = process.env.IMPERIAL_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // extract authorisation endpoint from wellknow response
    const authorization_endpoint = await getAuthorisationEndpoint(wellknownUrl)
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      const props: RedirectToProps = {
        authorization_endpoint,
        redirect_uri: process.env.IMPERIAL_REDIRECT || 'https://research-software.nl/auth/login/imperial',
        client_id: process.env.IMPERIAL_CLIENT_ID || 'www.research-software.nl',
        scope: process.env.IMPERIAL_SCOPES || 'openid',
        response_mode: process.env.IMPERIAL_RESPONSE_MODE || 'query',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/imperial: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'IMPERIAL_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/imperial: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function imperialInfo() {
  // extract all props from env and wellknow endpoint
  const redirectProps = await imperialRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'IMPERIAL',
      redirectUrl,
      html: `
        Sign in with your Imperial credentials!
      `
    }
  }
  return null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // extract all props from env and wellknow endpoint
    // and create return url and the name to use in login button
    const loginInfo = await imperialInfo()
    if (loginInfo) {
      res.status(200).json(loginInfo)
    } else {
      res.status(400).json({
        status: 400,
        message: 'loginInfo missing'
      })
    }
  } catch (e: any) {
    logger(`api/fe/auth/imperial: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
