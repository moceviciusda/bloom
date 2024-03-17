import { Flex } from '@chakra-ui/react';
import { getServerAuthSession } from '~/server/auth';
import { redirect } from 'next/navigation';
import NavBar from './_components/navbar';
import MainAside from './main-aside';

const OrganizationRootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationSlug: string };
}) => {
  const session = await getServerAuthSession();
  if (!session) return redirect(`/?next=/${params.organizationSlug}`);

  const currentOrg = session.user.organizations.find(
    (org) => org.slug === params.organizationSlug
  );

  if (!currentOrg)
    return redirect(`/${params.organizationSlug}/request-access`);

  return (
    <Flex minH='100vh' flexDir='column'>
      <NavBar currentOrg={currentOrg} session={session} />
      <MainAside>{children}</MainAside>
    </Flex>
  );
};

export default OrganizationRootLayout;
