import { Divider, Flex, Heading } from '@chakra-ui/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Dashboard
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default DashboardLayout;
