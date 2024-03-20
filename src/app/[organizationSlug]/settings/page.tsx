import { VStack } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import AccessSettings from '~/app/_components/organization-settings/access-settings';
import DangerZone from '~/app/_components/organization-settings/danger-zone';
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
    <VStack py={3} align='stretch' maxW='60em'>
      <GeneralSettings organization={organization} />
      <AccessSettings organization={organization} />
      <DangerZone organization={organization} />
    </VStack>
  );
};

export default OrganizationPage;
