import { Flex, Button } from '@chakra-ui/react';
import Link from 'next/link';

const LandingNavbar: React.FC = () => {
  return (
    <>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        as='header'
        zIndex={9999}
        p={2}
        bg='blackAlpha.200'
        backdropFilter='blur(10px)'
        borderRadius={8}
        align='center'
        gap={2}
        color='white'
      >
        <Link href='#'>
          <Button
            colorScheme='whiteAlpha'
            variant='ghost'
            _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
          >
            Documentation
          </Button>
        </Link>
        <Link href='#'>
          <Button
            colorScheme='whiteAlpha'
            variant='ghost'
            _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
          >
            Pricing
          </Button>
        </Link>
      </Flex>
    </>
  );
};

export default LandingNavbar;
