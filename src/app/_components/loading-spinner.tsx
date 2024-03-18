import { Center, Spinner } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Center flex={1}>
      <Spinner size='xl' color='purple.600' thickness='4px' />
    </Center>
  );
};

export default LoadingSpinner;
