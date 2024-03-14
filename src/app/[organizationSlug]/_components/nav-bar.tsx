'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useState } from 'react';
import { IoClose, IoMenu } from 'react-icons/io5';
import SignOutButton from '~/app/_components/sign-out-button';

const MenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => {
  return (
    <Box display={{ base: 'block', sm: 'none' }} onClick={toggle}>
      {isOpen ? <IoClose /> : <IoMenu />}
    </Box>
  );
};

const NavButtons = ({
  isOpen,
  organizations,
}: {
  isOpen: boolean;
  organizations: Organization[];
}) => {
  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', sm: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
    >
      <Stack
        spacing={1}
        align='center'
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'column', 'row', 'row']}
        flexWrap={'wrap'}
        pt={[4, 4, 0, 0]}
      >
        {organizations.map((org) => (
          <Button key={org.id} as='a' href={`/${org.slug}`}>
            {org.name}
          </Button>
        ))}

        <SignOutButton />
      </Stack>
    </Box>
  );
};

interface NavBarProps {
  organizations: Organization[];
  currentOrg: Organization;
}

const NavBar: React.FC<NavBarProps> = ({ organizations, currentOrg }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex align='center' p={4} bg='purple.900' color='white'>
      <Link
        href='/'
        fontSize='xl'
        fontWeight='bold'
        color={'purple.300'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        Bloom -
      </Link>
      <Heading size='md'>{currentOrg.name}</Heading>
      <Spacer />

      <MenuToggle toggle={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      <NavButtons isOpen={isOpen} organizations={organizations} />
    </Flex>
  );
};

export default NavBar;
