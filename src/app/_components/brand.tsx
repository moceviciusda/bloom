import { Box } from '@chakra-ui/react';
import { Grand_Hotel } from 'next/font/google';

const grandHotel = Grand_Hotel({
  subsets: ['latin'],
  weight: '400',
});

export const MiniBrand = () => {
  return (
    <Box
      //   bg='purple.800'
      paddingTop={1}
      paddingX={3}
      //   borderRadius={6}
      lineHeight={1}
      className={grandHotel.className}
      color={'purple.600'}
      fontSize={40}
    >
      B
    </Box>
  );
};

const Brand = () => {
  return (
    <Box
      //   bg='purple.800'
      paddingTop={1}
      paddingX={3}
      //   borderRadius={6}
      lineHeight={1}
      className={grandHotel.className}
      color={'purple.600'}
      fontSize={40}
    >
      Bloom
    </Box>
  );
};

export default Brand;
