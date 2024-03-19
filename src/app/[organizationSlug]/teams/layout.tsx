import { Divider, Flex, Heading } from '@chakra-ui/react';

interface TeamsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const TeamsLayout: React.FC<TeamsLayoutProps> = ({ children }) => {
  return (
    <Flex p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Organization Settings
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default TeamsLayout;
