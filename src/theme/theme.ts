import { extendTheme } from '@chakra-ui/react';

const styles = {
  global: {
    ':not(.chakra-dont-set-collapse) > .chakra-collapse': {
      overflow: 'initial !important',
    },
  },
};

const config = {
  initialColorMode: 'light',
};

const theme = extendTheme({ config, styles });

export default theme;
