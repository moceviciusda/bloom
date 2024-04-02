import { Flex } from '@chakra-ui/react';
import LoadingSpinner from '~/app/_components/loading-spinner';

const MatrixViewLoading = () => {
  return (
    <Flex flex={1} p={3} flexDir='column' align='center' justify='center'>
      <LoadingSpinner />
    </Flex>
  );
};

export default MatrixViewLoading;
