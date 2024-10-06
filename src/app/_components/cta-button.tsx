'use client';

import { Box, BoxProps, keyframes, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const glow = keyframes`
    100% {
        transform: rotate(1turn);
    }
`;

const CtaButton: React.FC<BoxProps> = (props) => {
  return (
    <Box
      position='relative'
      fontSize='22'
      borderRadius='md'
      //   bg='purple.300'
      //   bg='rgba(0, 17, 82, .8)'
      overflow='hidden'
      padding={2}
      px={4}
      whiteSpace='nowrap'
      _before={{
        content: '""',
        position: 'absolute',
        inset: -1000,
        borderRadius: 'inherit',
        zIndex: -1,
        bg: `conic-gradient(from 0deg, var(--chakra-colors-blue-600), var(--chakra-colors-purple-300), var(--chakra-colors-blue-600))`,
        filter: 'blur(10px)',
        animation: `${glow} 2s infinite linear`,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        bg: 'purple.300',
        inset: 0.5,
        borderRadius: 'inherit',
        // zIndex: -1,
        // bg: `conic-gradient(from 160deg, rgb(0, 17, 82), var(--chakra-colors-purple-300), rgb(0, 17, 82))`,
        // filter: 'blur(10px)',
      }}
      //   boxShadow='2px 4px 6px rgba(0, 0, 0, .5)'
      _hover={{
        transform: 'scale(1.1) rotate(-8deg)',
        boxShadow: '0 0 10px 5px rgba(100, 167, 255, 0.5)',
      }}
      transition='all .2s'
      cursor='default'
      {...props}
    >
      <Text position='relative' zIndex={1}>
        Try it out for free today!
      </Text>
    </Box>
  );
};

export default CtaButton;
