import { HStack, type StackProps } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface NavLinkProps extends StackProps {
  children: React.ReactNode;
  href?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, href, ...rest }) => {
  return (
    <HStack
      as={Link}
      href={href ?? '#'}
      p={2}
      borderRadius={6}
      _hover={{
        bg: 'gray.200',
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

export default NavLink;
