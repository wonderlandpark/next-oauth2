import type { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from '@node-oauth/oauth2-server';

import oauth from '@/utils/oauthServer'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const request = new Request(req);
  const response = new Response(res);

  switch (req.method) {
    case 'POST': {
      try {
        const token = await oauth.token(request, response);
        res.status(200).json(token);
      } catch (error: any) {
        res.status(error?.code || 500).json({ error: error.message });
      }
      break;
    }
    case 'GET': {
      try {
        const token = await oauth.authenticate(request, response);
        res.status(200).json(token);
      } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}