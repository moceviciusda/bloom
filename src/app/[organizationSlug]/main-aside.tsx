'use client';

import { Box } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import SideBar from './_components/sidebar';
import { type Organization } from '@prisma/client';

const MainAside = ({
  children,
  currentOrg,
}: {
  children: ReactNode;
  currentOrg: Organization;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={{ base: '0px', md: '65px', lg: isOpen ? '200px' : '65px' }}
        display={{ base: 'none', md: 'block' }}
        organizationSlug={currentOrg.slug}
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
