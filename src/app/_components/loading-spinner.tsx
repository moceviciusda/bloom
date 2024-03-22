import { Center, Spinner, type SpinnerProps } from '@chakra-ui/react';

const LoadingSpinner: React.FC<SpinnerProps> = (props) => {
  return (
    <Center flex={1}>
      <Spinner size='xl' color='purple.600' thickness='4px' {...props} />
    </Center>
  );
};

export default LoadingSpinner;
