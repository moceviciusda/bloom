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

const theme = extendTheme({
  config,
  styles,
  components: {
    Popover: {
      variants: {
        responsive: {
          content: {
            maxWidth: 'unset',
            width: 'unset',
          },
        },
      },
    },
  },
});

export default theme;
