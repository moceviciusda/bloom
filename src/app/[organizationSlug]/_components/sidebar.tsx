'use client';

import { Box, type ChakraProps, Icon, Text, VStack } from '@chakra-ui/react';
import { type SetStateAction, type Dispatch } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import NavLinks, { NavLink } from './nav-links';

interface SideBarProps extends ChakraProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  organizationSlug: string;
}

const SideBar: React.FC<SideBarProps> = ({
  isOpen,
  setIsOpen,
  organizationSlug,
  ...rest
}) => {
  return (
    <Box
      as='aside'
      pos='fixed'
      top={14}
      bottom={0}
      zIndex={1}
      bg='gray.50'
      borderRight='1px solid var(--chakra-colors-blackAlpha-200)'
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
        <NavLinks orgSlug={organizationSlug} />

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

export default SideBar;
