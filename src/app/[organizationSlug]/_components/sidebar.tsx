'use client';

import {
  Box,
  type ChakraProps,
  Icon,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type SetStateAction, type Dispatch } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { RiHome3Line, RiTeamLine, RiUserLine } from 'react-icons/ri';
import {
  MdOutlineAssessment,
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import NavLink from './nav-link';

interface SideBarProps extends ChakraProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen, ...rest }) => {
  return (
    <Box
      as='aside'
      pos='fixed'
      top={14}
      bottom={0}
      zIndex={1}
      bg='gray.50'
      borderRight='1px solid var(--chakra-colors-blackAlpha-300)'
      p={3}
      transition='width 0.3s'
      overflowX='hidden'
      {...rest}
    >
      <VStack
        as='nav'
        h='100%'
        justify='space-between'
        align='flex-start'
        overflowX='hidden'
      >
        <NavLinks />

        <NavLink
          onClick={() => setIsOpen(!isOpen)}
          w='100%'
          display={{ base: 'none', lg: 'flex' }}
        >
          <Icon
            as={FaChevronRight}
            m={1}
            boxSize={4}
            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
            transitionDuration={'0.3s'}
          />
          <Text as='span' fontWeight='500'>
            Collapse
          </Text>
        </NavLink>
      </VStack>
    </Box>
  );
};

export const NavLinks = () => {
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
        <NavLink>
          <Icon as={MdOutlineAssignment} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Assignments
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink>
          <Icon as={RiUserLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Users
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink>
          <Icon as={RiTeamLine} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Teams
          </Text>
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink>
          <Icon as={MdOutlineSpaceDashboard} boxSize={5} m={0.5} />
          <Text as='span' fontWeight='500'>
            Matrix Builder
          </Text>
        </NavLink>
      </ListItem>
    </List>
  );
};

export default SideBar;
