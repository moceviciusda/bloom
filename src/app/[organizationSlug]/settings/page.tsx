import { unstable_noStore as noStore } from 'next/cache';
import { VStack } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import AccessSettings from '~/app/[organizationSlug]/settings/_sections/access-settings';
import DangerZone from '~/app/[organizationSlug]/settings/_sections/danger-zone';
import GeneralSettings from '~/app/[organizationSlug]/settings/_sections/general-form';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

interface OrganizationSettingsProps {
  params: { organizationSlug: string };
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = async ({
  params,
}) => {
  noStore();
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
      {isOwner && <DangerZone organization={organization} />}
    </VStack>
  );
};

export default OrganizationSettings;
