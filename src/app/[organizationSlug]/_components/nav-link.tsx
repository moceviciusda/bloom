import {
  HStack,
  Icon,
  List,
  ListItem,
  Text,
  type StackProps,
} from '@chakra-ui/react';
import Link from 'next/link';
import {
  MdOutlineAssessment,
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import { RiHome3Line, RiUserLine, RiTeamLine } from 'react-icons/ri';

interface NavLinkProps extends StackProps {
  children: React.ReactNode;
  href?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  ...rest
}) => {
  return (
    <HStack
      as={Link}
      href={href ?? '#'}
      p={2}
      borderRadius={6}
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
  return (
    <List spacing={2} w='100%' whiteSpace='nowrap'>
      <ListItem>
        <NavLink>
          <Icon as={RiHome3Line} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Home
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink>
          <Icon as={MdOutlineAssessment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Dashboard
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink href={`/${orgSlug}/assignments`}>
          <Icon as={MdOutlineAssignment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Assignments
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink href={`/${orgSlug}/users`}>
          <Icon as={RiUserLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Users
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink href={`/${orgSlug}/teams`}>
          <Icon as={RiTeamLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Teams
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink href={`/${orgSlug}/matrix`}>
          <Icon as={MdOutlineSpaceDashboard} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Matrix Builder
          </Text>
        </NavLink>
      </ListItem>
    </List>
  );
};

export default NavLinks;
