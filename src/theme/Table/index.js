import { mode } from '@chakra-ui/theme-tools';

const numericStyles = {
  '&[data-is-numeric=true]': {
    textAlign: 'end',
  },
};

export const TableTheme = {
  components: {
    Table: {
      variants: {
        colorHeader: (props) => {
          const { colorScheme } = props;
          return {
            th: {
              color: mode(`${colorScheme}.600`, `${colorScheme}.400`)(props),
              borderBottom: '1px',
              borderColor: mode(
                `${colorScheme}.100`,
                `${colorScheme}.700`
              )(props),
              ...numericStyles,
            },
            td: {
              borderBottom: '1px',
              borderColor: mode(
                `${colorScheme}.100`,
                `${colorScheme}.700`
              )(props),
              ...numericStyles,
            },
            caption: {
              color: mode(`gray.600`, `gray.100`)(props),
            },
            tfoot: {
              tr: {
                '&:last-of-type': {
                  th: { borderBottomWidth: 0 },
                },
              },
            },
          };
        },
      },
    },
  },
};
