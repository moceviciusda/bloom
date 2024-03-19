import {
  HStack,
  Icon,
  List,
  ListItem,
  Text,
  type StackProps,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdOutlineAssessment,
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import {
  RiHome3Line,
  RiUserLine,
  RiTeamLine,
  RiSettings3Line,
} from 'react-icons/ri';

interface NavLinkProps extends StackProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  active,
  ...rest
}) => {
  return (
    <HStack
      as={Link}
      href={href ?? '#'}
      p={2}
      borderRadius={6}
      bg={active ? 'gray.200' : 'transparent'}
      _hover={{
        bg: 'gray.100',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
      }}
      {...rest}
    >
      {children}
      {/* <Icon as={FaHome} boxSize={4} m={1} />
      <Text as='span'>Dashboard</Text> */}
    </HStack>
  );
};

const NavLinks = ({ orgSlug }: { orgSlug: string }) => {
  const pathname = usePathname();

  return (
    <List spacing={2} w='100%' whiteSpace='nowrap'>
      <ListItem>
        <NavLink href={`/${orgSlug}`} active={pathname === `/${orgSlug}`}>
          <Icon as={RiHome3Line} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Home
          </Text>
        </NavLink>
      </ListItem>
      {/* <ListItem>
        <NavLink
          href={`/${orgSlug}/dashboard`}
          active={pathname === `/${orgSlug}/dashboard`}
        >
          <Icon as={MdOutlineAssessment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Dashboard
          </Text>
        </NavLink>
      </ListItem> */}
      <ListItem>
        <NavLink
          href={`/${orgSlug}/assignments`}
          active={pathname === `/${orgSlug}/assignments`}
        >
          <Icon as={MdOutlineAssignment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Assignments
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${orgSlug}/users`}
          active={pathname === `/${orgSlug}/users`}
        >
          <Icon as={RiUserLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Users
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${orgSlug}/teams`}
          active={pathname === `/${orgSlug}/teams`}
        >
          <Icon as={RiTeamLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Teams
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${orgSlug}/matrix`}
          active={pathname === `/${orgSlug}/matrix`}
        >
          <Icon as={MdOutlineSpaceDashboard} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Matrix Builder
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${orgSlug}/settings`}
          active={pathname === `/${orgSlug}/settings`}
        >
          <Icon as={RiSettings3Line} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Settings
          </Text>
        </NavLink>
      </ListItem>
    </List>
  );
};

export default NavLinks;
