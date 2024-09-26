import { Box, BoxProps } from '@chakra-ui/react';
import { Grand_Hotel } from 'next/font/google';

const grandHotel = Grand_Hotel({
  subsets: ['latin'],
  weight: '400',
});

export const MiniBrand = () => {
  return (
    <Box
      paddingTop={1}
      paddingX={3}
      lineHeight={1}
      className={grandHotel.className}
      color={'purple.600'}
      fontSize={40}
    >
      B
    </Box>
  );
};

const Brand: React.FC<BoxProps> = (props) => {
  return (
    <Box
      lineHeight={1}
      className={grandHotel.className}
      color={'purple.600'}
      fontSize={40}
      {...props}
    >
      Bloom
    </Box>
  );
};

export default Brand;
