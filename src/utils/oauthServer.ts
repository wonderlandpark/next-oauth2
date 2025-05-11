import OAuth2Server, { Request, Response } from '@node-oauth/oauth2-server';

import * as Model from '@/utils/oauthModel';
import { TOKEN_EXPIRES_AT } from '@/utils/constants'

const oauth = new OAuth2Server({
  model: Model,
  accessTokenLifetime: TOKEN_EXPIRES_AT,
  allowBearerTokensInQueryString: true,
})

export default oauth