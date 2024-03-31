import { Flex, Icon, Text } from '@chakra-ui/react';
import { FaWeightHanging } from 'react-icons/fa6';

export const WeightIcon = ({
  weight,
  size = 24,
}: {
  weight: number;
  size?:
    | number
    | {
        base?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
      };
}) => {
  let fontSize, sizeValue, marginValue;
  if (typeof size === 'number') {
    fontSize = size / 2;
    sizeValue = `${size}px`;
    marginValue = `-${size}px`;
  } else {
    fontSize = {
      base: size.base ? size.base / 2 : undefined,
      sm: size.sm ? size.sm / 2 : undefined,
      md: size.md ? size.md / 2 : undefined,
      lg: size.lg ? size.lg / 2 : undefined,
      xl: size.xl ? size.xl / 2 : undefined,
      '2xl': size['2xl'] ? size['2xl'] / 2 : undefined,
    };
    sizeValue = {
      base: size.base ? `${size.base}px` : undefined,
      sm: size.sm ? `${size.sm}px` : undefined,
      md: size.md ? `${size.md}px` : undefined,
      lg: size.lg ? `${size.lg}px` : undefined,
      xl: size.xl ? `${size.xl}px` : undefined,
      '2xl': size['2xl'] ? `${size['2xl']}px` : undefined,
    };
    marginValue = {
      base: size.base ? `-${size.base}px` : undefined,
      sm: size.sm ? `-${size.sm}px` : undefined,
      md: size.md ? `-${size.md}px` : undefined,
      lg: size.lg ? `-${size.lg}px` : undefined,
      xl: size.xl ? `-${size.xl}px` : undefined,
      '2xl': size['2xl'] ? `-${size['2xl']}px` : undefined,
    };
  }

  return (
    <Flex align='center'>
      <Icon as={FaWeightHanging} boxSize={sizeValue} />
      <Text
        alignSelf='flex-end'
        fontSize={fontSize}
        ml={marginValue}
        w={sizeValue}
        color='white'
      >
        {weight}
      </Text>
    </Flex>
  );
};
