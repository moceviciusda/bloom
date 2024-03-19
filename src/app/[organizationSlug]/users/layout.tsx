import { Divider, Flex, Heading } from '@chakra-ui/react';

interface UsersLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children }) => {
  return (
    <Flex p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Users
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default UsersLayout;
