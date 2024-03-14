import { Box } from '@chakra-ui/react';
import NavBar from './_components/nav-bar';
import { api } from '~/trpc/server';
import { getServerAuthSession } from '~/server/auth';
import { redirect } from 'next/navigation';

const OrganizationRootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationSlug: string };
}) => {
  const session = await getServerAuthSession();

  if (!session) return redirect(`/?next=/${params.organizationSlug}`);

  const organizations = await api.organization.getAll.query();

  const currentOrg = organizations.find(
    (org) => org.slug === params.organizationSlug
  );

  if (!currentOrg)
    return redirect(`/${params.organizationSlug}/request-access`);

  return (
    <Box minH='100vh'>
      <NavBar currentOrg={currentOrg} organizations={organizations} />
      {children}
    </Box>
  );
};

export default OrganizationRootLayout;
