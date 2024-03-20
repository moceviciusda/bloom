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

const components = {
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
  Tooltip: {
    variants: {
      bloom: {
        borderRadius: 5,
        bg: 'blackAlpha.700',
      },
    },
  },
};

const theme = extendTheme({
  config,
  styles,
  components,
});

export default theme;
