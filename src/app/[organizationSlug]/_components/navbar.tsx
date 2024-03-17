'use client';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { type Session } from 'next-auth';
import { useState } from 'react';
import { IoClose, IoMenu } from 'react-icons/io5';
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import { LuPlusCircle } from 'react-icons/lu';
import SignOutButton from '~/app/_components/sign-out-button';
import UserPlate from '~/app/_components/user-plate';
import NavLink from './nav-link';

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
  session,
}: {
  isOpen: boolean;
  session: Session;
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
        <NavLink>
          <UserPlate user={session.user} />
        </NavLink>
      </Stack>
    </Box>
  );
};

interface NavbarProps {
  session: Session;
  currentOrg: Organization;
}

const NavBar: React.FC<NavbarProps> = ({ session, currentOrg }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
      as={'header'}
      h={14}
      position='sticky'
      top={0}
      zIndex={1}
      align='center'
      bg='purple.600'
      p={2}
      gap={2}
      // color='white'
    >
      <Link
        href='/'
        fontSize='lg'
        fontWeight='bold'
        color={'purple.300'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        Bloom
      </Link>

      <OrganizationSelector session={session} currentOrg={currentOrg} />

      <Spacer />

      <MenuToggle toggle={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      <NavButtons isOpen={isOpen} session={session} />
    </Flex>
  );
};

const OrganizationSelector = ({
  session,
  currentOrg,
}: {
  session: Session;
  currentOrg: Organization;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button gap={2}>
          <Avatar size='xs' name={currentOrg.name} />
          <Text as='span' fontWeight='500'>
            {currentOrg.name}
          </Text>
          <Icon as={HiMiniChevronUpDown} boxSize={4} />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            {session.user.organizations.map((org) => (
              <NavLink key={org.id} href={`/${org.slug}`}>
                <Avatar size='xs' name={org.name} />
                <Text as='span' fontWeight='500'>
                  {org.name}
                </Text>
              </NavLink>
            ))}
          </PopoverBody>
          <PopoverFooter>
            <NavLink>
              <Icon as={LuPlusCircle} boxSize={6} />
              <Text as='span' fontWeight='500'>
                Create Organization
              </Text>
            </NavLink>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default NavBar;
