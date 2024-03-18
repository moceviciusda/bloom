import { Box } from '@chakra-ui/react';

interface UsersLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children, params }) => {
  return <Box p={6}>{children}</Box>;
};

export default UsersLayout;
