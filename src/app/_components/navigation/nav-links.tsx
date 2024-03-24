import {
  HStack,
  Icon,
  List,
  ListItem,
  Text,
  type StackProps,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  // MdOutlineAssessment,
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import {
  RiHome3Line,
  RiUserLine,
  RiTeamLine,
  RiSettings3Line,
} from 'react-icons/ri';
import { api } from '~/trpc/react';

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
    </HStack>
  );
};

const NavLinks = ({ organization }: { organization: Organization }) => {
  const pathname = usePathname();

  const { data: session } = useSession({ required: true });
  const { data: admins } = api.organization.getAdmins.useQuery({
    slug: organization.slug,
  });

  const isOwnerOrAdmin =
    organization.ownerId === session?.user.id ||
    admins?.some((admin) => admin.user.id === session?.user.id);

  return (
    <List spacing={2} w='100%' whiteSpace='nowrap'>
      <ListItem>
        <NavLink
          href={`/${organization.slug}`}
          active={pathname === `/${organization.slug}`}
        >
          <Icon as={RiHome3Line} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Home
          </Text>
        </NavLink>
      </ListItem>
      {/* <ListItem>
        <NavLink
          href={`/${organization.slug}/dashboard`}
          active={pathname === `/${organization.slug}/dashboard`}
        >
          <Icon as={MdOutlineAssessment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Dashboard
          </Text>
        </NavLink>
      </ListItem> */}
      <ListItem>
        <NavLink
          href={`/${organization.slug}/assignments`}
          active={pathname === `/${organization.slug}/assignments`}
        >
          <Icon as={MdOutlineAssignment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Assignments
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${organization.slug}/users`}
          active={pathname === `/${organization.slug}/users`}
        >
          <Icon as={RiUserLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Users
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${organization.slug}/teams`}
          active={pathname === `/${organization.slug}/teams`}
        >
          <Icon as={RiTeamLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Teams
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          href={`/${organization.slug}/matrix`}
          active={pathname === `/${organization.slug}/matrix`}
        >
          <Icon as={MdOutlineSpaceDashboard} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Matrix Builder
          </Text>
        </NavLink>
      </ListItem>
      {isOwnerOrAdmin && (
        <ListItem>
          <NavLink
            href={`/${organization.slug}/settings`}
            active={pathname === `/${organization.slug}/settings`}
          >
            <Icon as={RiSettings3Line} boxSize={5} m={0.5} />
            <Text as='span' fontWeight='500'>
              Settings
            </Text>
          </NavLink>
        </ListItem>
      )}
    </List>
  );
};

export default NavLinks;
