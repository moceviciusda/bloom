import { Heading } from '@chakra-ui/react';

interface UsersPageProps {
  params: { organizationSlug: string };
}

const UsersPage: React.FC<UsersPageProps> = ({ params }) => {
  return <Heading>Users</Heading>;
};

export default UsersPage;
