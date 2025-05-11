import { GetServerSideProps } from 'next';
import prisma from '@/utils/prisma';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { client_id, scope, redirect_uri } = context.query;

  if (!client_id || !scope || !redirect_uri) {
    return {
      notFound: true,
    };
  }

  // Validate client_id and scope (add your validation logic here)
  const client = await prisma.client.findUnique({ where: { id: client_id as string } });
  if (!client) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      clientName: client.name,
      scope,
      redirectUri: redirect_uri,
    },
  };
};

export default function Authorize({ clientName, scope, redirectUri }: { clientName: string; scope: string; redirectUri: string }) {
  return (
    <div>
      <h1>Authorize {clientName}</h1>
      <p>This application is requesting the following permissions: {scope}</p>
      <form method="POST" action="/api/oauth2/authorize">
        <input type="hidden" name="redirect_uri" value={redirectUri} />
        <button type="submit" name="action" value="accept">Accept</button>
        <button type="submit" name="action" value="decline">Decline</button>
      </form>
    </div>
  );
}