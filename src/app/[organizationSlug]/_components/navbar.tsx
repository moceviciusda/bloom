'use client';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { type Session } from 'next-auth';
import { IoClose, IoMenu } from 'react-icons/io5';
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import SignOutButton from '~/app/_components/sign-out-button';
import UserPlate from '~/app/_components/user-plate';
import NavLinks, { NavLink } from './nav-link';
import Brand, { MiniBrand } from '~/app/_components/brand';
import OrganizationPlate from '~/app/_components/organization-plate';
import { TbCalendarDollar } from 'react-icons/tb';
import { MdHelpOutline } from 'react-icons/md';
import { RiProfileLine, RiSettings3Line } from 'react-icons/ri';
import { CreateOrganization } from '~/app/_components/organization-card/create-organization';

interface NavbarProps {
  session: Session;
  currentOrg: Organization;
}

const NavBar: React.FC<NavbarProps> = ({ session, currentOrg }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const brand = useBreakpointValue({ base: <MiniBrand />, sm: <Brand /> });

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
      borderBottom='1px solid var(--chakra-colors-blackAlpha-200)'
    >
      <Link
        href='/'
        _hover={{
          textDecoration: 'none',
        }}
      >
        {brand}
      </Link>
      <HStack flex={1} justify='space-between' minW={0}>
        <OrganizationSelector session={session} currentOrg={currentOrg} />

        <HStack>
          {/* <NavLink paddingY={1} paddingX={{ base: 1, md: 2 }}>
            <UserPlate
              user={session.user}
              textContainerProps={{ display: { base: 'none', md: 'flex' } }}
              userNameProps={{ fontWeight: '500' }}
            />
          </NavLink> */}
          <UserMenu session={session} />
          <Button
            onClick={onOpen}
            variant='ghost'
            p={2}
            display={{ base: 'flex', md: 'none' }}
          >
            <Icon as={IoMenu} boxSize={6} />
          </Button>
          <Drawer placement='top' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent display={{ base: 'flex', md: 'none' }}>
              <DrawerHeader p={2}>
                <Flex justify='space-between'>
                  <Link
                    href='/'
                    _hover={{
                      textDecoration: 'none',
                    }}
                  >
                    <Brand />
                  </Link>
                  <Button onClick={onClose} variant='ghost' p={2}>
                    <Icon as={IoClose} boxSize={6} />
                  </Button>
                </Flex>
              </DrawerHeader>

              <DrawerBody p={6}>
                <NavLinks orgSlug={currentOrg.slug} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover variant='responsive' placement='bottom-start'>
      <PopoverTrigger>
        <Button p={2} gap={2} variant='ghost' minW='60px' maxW='420px'>
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
          fontWeight='500'
          color='blackAlpha.700'
          maxW={{ base: '280px', md: '420px' }}
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
            {/* <NavLink>
              <Icon as={LuPlusCircle} boxSize={6} />
              <Text as='span'>Create Organization</Text>
            </NavLink> */}
            <Button w='100%' colorScheme='purple' onClick={onOpen}>
              <Text>Create New Organization</Text>
            </Button>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New Organization</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <CreateOrganization />
                </ModalBody>
              </ModalContent>
            </Modal>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

const UserMenu = ({ session }: { session: Session }) => {
  return (
    <Popover variant='responsive' placement='bottom-end'>
      <PopoverTrigger>
        <Button variant='ghost' paddingY={1} paddingX={{ base: 1, md: 2 }}>
          <UserPlate
            user={session.user}
            textContainerProps={{ display: { base: 'none', md: 'flex' } }}
            userNameProps={{ fontWeight: '500' }}
          />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent minW={'236px'} fontWeight='500' color='blackAlpha.700'>
          <PopoverHeader display={{ md: 'none' }}>
            <UserPlate
              user={session.user}
              textContainerProps={{ display: 'flex' }}
              avatarProps={{ display: 'none' }}
              userNameProps={{
                color: 'blackAlpha.900',
                fontWeight: '500',
                lineHeight: 'unset',
              }}
              userEmailProps={{ fontSize: 'xs' }}
            />
          </PopoverHeader>
          <PopoverBody p={1}>
            <NavLink>
              <Icon as={RiProfileLine} boxSize={5} />
              <Text>Profile</Text>
            </NavLink>
            <NavLink>
              <Icon as={RiSettings3Line} boxSize={5} />
              <Text>Settings</Text>
            </NavLink>
            <NavLink>
              <Icon as={TbCalendarDollar} boxSize={5} />
              <Text>Billing</Text>
            </NavLink>
            <NavLink>
              <Icon as={MdHelpOutline} boxSize={5} />
              <Text>Help</Text>
            </NavLink>
          </PopoverBody>
          <PopoverFooter p={1}>
            <SignOutButton w='100%' colorScheme='purple'>
              Sign Out
            </SignOutButton>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default NavBar;
