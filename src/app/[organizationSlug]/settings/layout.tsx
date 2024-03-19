import { Heading } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

interface OrgSettingsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const OrgSettingsLayout: React.FC<OrgSettingsLayoutProps> = async ({
  children,
  params,
}) => {
  const session = await getServerAuthSession();
  if (!session) return redirect(`/?next=/${params.organizationSlug}`);

  const organization = await api.organization.getBySlug.query({
    slug: params.organizationSlug,
  });

  if (organization?.ownerId !== session.user.id)
    return redirect(`/${params.organizationSlug}`);

  return (
    <>
      <Heading p={6}>{organization?.name} Settings</Heading>
      {children}
    </>
  );
};

export default OrgSettingsLayout;
