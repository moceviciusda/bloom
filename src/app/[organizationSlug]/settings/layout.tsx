import { Heading } from '@chakra-ui/react';
import { api } from '~/trpc/server';

interface OrgSettingsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const OrgSettingsLayout: React.FC<OrgSettingsLayoutProps> = async ({
  children,
  params,
}) => {
  const organization = await api.organization.getBySlug.query({
    slug: params.organizationSlug,
  });

  return (
    <>
      <Heading p={6}>{organization?.name} Settings</Heading>
      {children}
    </>
  );
};

export default OrgSettingsLayout;
