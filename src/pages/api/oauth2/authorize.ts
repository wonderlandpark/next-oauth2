import type { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from '@node-oauth/oauth2-server';

import oauth from '@/utils/oauthServer'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['content-type']?.includes('application/json')) {
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  const request = new Request(req);
  const response = new Response(res);

  switch (req.method) {
    case 'GET': {
      try {
        const token = await oauth.authorize(request, response, {
          allowEmptyState: true,
          authenticateHandler: {
            handle: async (req: Request) => {
              
            }
          }
        });
        res.status(200).json(token);
      } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}