import {
  Button,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { RiEdit2Line } from 'react-icons/ri';
import UserPlate from '~/app/_components/user-plate';
import { api } from '~/trpc/server';

interface UsersPageProps {
  params: { organizationSlug: string };
}

const UsersPage: React.FC<UsersPageProps> = async ({ params }) => {
  // //mock await function to simulate loading
  // const sleep = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await sleep(100000);

  const users = await api.organization.getUsers.query({
    slug: params.organizationSlug,
  });

  return (
    <TableContainer height='100%'>
      <Table colorScheme='purple' size='sm'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Title</Th>
            <Th>Teams</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users?.map((user) => (
            <Tr key={user.id} _hover={{ bg: 'purple.50' }}>
              <Td>
                <UserPlate
                  key={user.id}
                  user={user}
                  userEmailProps={{ display: 'none' }}
                />
              </Td>
              <Td>{user.email}</Td>
              <Td>Member</Td>
              <Td>
                <Tag colorScheme='purple'>Team</Tag>
              </Td>
              <Td>
                <Button
                  p={2}
                  variant='ghost'
                  color='blackAlpha.700'
                  _hover={{ bg: 'purple.100' }}
                >
                  <RiEdit2Line />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UsersPage;
