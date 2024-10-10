import { Button, type ButtonProps } from '@chakra-ui/react';

const CtaButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      size='lg'
      position='relative'
      colorScheme='purple'
      border='2px solid white'
      borderRadius='lg'
      {...props}
    >
      Try it out for free today!
    </Button>
  );
};

export default CtaButton;
