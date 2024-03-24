import { Divider, Flex, Heading } from '@chakra-ui/react';

interface OrganizationSettingsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const OrganizationSettingsLayout: React.FC<OrganizationSettingsLayoutProps> = ({
  children,
}) => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Organization Settings
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default OrganizationSettingsLayout;
