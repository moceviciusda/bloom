import { extendTheme } from '@chakra-ui/react';
import { ProgressTheme } from './Progress';
import { SwitchTheme } from './Switch';
import { TableTheme } from './Table';

const styles = {
  global: {
    ':not(.chakra-dont-set-collapse) > .chakra-collapse': {
      overflow: 'initial !important',
    },
  },
};

const config = { initialColorMode: 'light' };

const components = {
  ...ProgressTheme.components,
  ...SwitchTheme.components,
  ...TableTheme.components,
};

const theme = extendTheme({ config, styles, components });

export default theme;
