'use client';

import { Flex } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import SideBar from './_components/sidebar';

const MainAside = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={isOpen ? '200px' : '65px'}
      />
      <Flex
        flex={1}
        as='main'
        ml={isOpen ? '200px' : '65px'}
        transition={'margin-left 0.3s'}
      >
        {children}
      </Flex>
    </>
  );
};

export default MainAside;
