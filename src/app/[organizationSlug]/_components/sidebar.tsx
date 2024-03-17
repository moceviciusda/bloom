'use client';

import { Box, Icon, List, ListItem, Text, VStack } from '@chakra-ui/react';
import { type SetStateAction, type Dispatch } from 'react';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import NavLink from './nav-link';

interface SideBarProps {
  width: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ width, isOpen, setIsOpen }) => {
  return (
    <Box
      as='aside'
      pos='fixed'
      top={14}
      bottom={0}
      zIndex={1}
      bg='gray.100'
      borderRight='1px solid #000'
      p={3}
      width={width}
      transition='width 0.3s'
      overflowX='hidden'
    >
      <VStack
        as='nav'
        h='100%'
        justify='space-between'
        align='flex-start'
        overflowX='hidden'
      >
        <List w='100%' spacing={4}>
          <ListItem>
            <NavLink>
              <Icon as={FaHome} boxSize={5} m={0.5} />
              <Text as='span' fontWeight='500'>
                Home
              </Text>
            </NavLink>
          </ListItem>
        </List>

        <NavLink onClick={() => setIsOpen(!isOpen)} w='100%'>
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

export default SideBar;
