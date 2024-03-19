import { Avatar, Divider, Heading, VStack } from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { redirect } from 'next/navigation';
import GeneralSettings from '~/app/_components/organization-settings/general-form';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

interface OrganizationPageProps {
  params: { organizationSlug: string };
}

const OrganizationPage: React.FC<OrganizationPageProps> = async ({
  params,
}) => {
  const session = await getServerAuthSession();
  if (!session) return redirect(`/?next=/${params.organizationSlug}`);

  const organization = await api.organization.getBySlug.query({
    slug: params.organizationSlug,
  });
  if (!organization) return redirect('/');

  const admins = await api.organization.getAdmins.query({
    slug: organization.slug,
  });
  const isAdmin = admins?.some((admin) => admin.user.id === session.user.id);
  const isOwner = organization.ownerId === session.user.id;

  if (!isAdmin && !isOwner) return redirect(`/${params.organizationSlug}`);

  return (
    <VStack py={3} align='stretch' maxW='50em'>
      <GeneralSettings organization={organization} />
    </VStack>
  );
};

export default OrganizationPage;
