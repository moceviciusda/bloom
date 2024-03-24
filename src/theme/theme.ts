import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';

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
        bg: 'blackAlpha.800',
      },
    },
  },
  Card: {
    variants: {
      hover: {
        ...defaultTheme.components.Card.variants?.elevated,

        container: {
          ...defaultTheme.components.Card.variants?.elevated.container,
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
          },
          transition: 'all 0.2s ease-in-out',
        },
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
