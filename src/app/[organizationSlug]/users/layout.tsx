import { Heading } from '@chakra-ui/react';

interface UsersLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children }) => {
  return (
    <>
      <Heading p={6}>Users</Heading>
      {children}
    </>
  );
};

export default UsersLayout;
