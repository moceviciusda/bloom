'use client';

import {
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
  useMediaQuery,
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
import Brand, { MiniBrand } from '~/app/_components/brand';
import OrganizationPlate from '~/app/_components/organization-plate';

interface NavbarProps {
  session: Session;
  currentOrg: Organization;
}

const NavBar: React.FC<NavbarProps> = ({ session, currentOrg }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');

  return (
    <Flex
      as={'header'}
      h={14}
      position='sticky'
      top={0}
      zIndex={1}
      align='center'
      bg='white'
      p={2}
      gap={2}
      borderBottom='1px solid var(--chakra-colors-blackAlpha-300)'
      // color='white'
    >
      <Link
        href='/'
        _hover={{
          textDecoration: 'none',
        }}
      >
        {isLargerThan480 ? <Brand /> : <MiniBrand />}
      </Link>
      <HStack flex={1} justify='space-between' minW={0}>
        <OrganizationSelector session={session} currentOrg={currentOrg} />

        <HStack>
          <NavLink paddingY={1} paddingX={{ base: 1, md: 2 }}>
            <UserPlate
              user={session.user}
              textContainerProps={{ display: { base: 'none', md: 'flex' } }}
              userNameProps={{ fontWeight: '500' }}
            />
          </NavLink>

          <NavLink display={{ base: 'flex', md: 'none' }}>
            <Icon as={IoMenu} boxSize={6} />
          </NavLink>
        </HStack>
      </HStack>
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
        <Button p={2} gap={2} variant='ghost' minW={0} maxW='420px'>
          <OrganizationPlate
            organization={currentOrg}
            minW={0}
            textProps={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
          <Icon as={HiMiniChevronUpDown} boxSize={4} />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          // w={'fit-content'}
          fontWeight='500'
          color='blackAlpha.700'
        >
          <PopoverBody p={1}>
            {session.user.organizations.map((org) => (
              <NavLink
                key={org.id}
                href={`/${org.slug}`}
                bg={org.id === currentOrg.id ? 'gray.100' : undefined}
              >
                <OrganizationPlate organization={org} />
              </NavLink>
            ))}
          </PopoverBody>
          <PopoverFooter p={1}>
            <NavLink>
              <Icon as={LuPlusCircle} boxSize={6} />
              <Text as='span'>Create Organization</Text>
            </NavLink>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default NavBar;
