'use client';

import { Box } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import SideBar from './_components/sidebar';

const MainAside = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={{ base: '0px', md: '65px', lg: isOpen ? '200px' : '65px' }}
        display={{ base: 'none', md: 'block' }}
      />
      <Box
        flex={1}
        as='main'
        ml={{ base: '0px', md: '65px', lg: isOpen ? '200px' : '65px' }}
        transition={'margin-left 0.3s'}
      >
        {children}
      </Box>
    </>
  );
};

export default MainAside;
