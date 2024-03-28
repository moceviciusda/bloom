import { Flex, Heading, Divider, Wrap } from '@chakra-ui/react';
import { MatrixCardSkeleton } from './_matrix-card/matrix-card';

const MatrixPage = () => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        My Matrices
      </Heading>
      <Divider />

      <Wrap spacing={3} py={4} justify={{ base: 'center', md: 'flex-start' }}>
        <MatrixCardSkeleton />
        <MatrixCardSkeleton />
        <MatrixCardSkeleton />
      </Wrap>

      <Heading size='lg' mb={3}>
        Shared with me
      </Heading>
      <Divider />

      <Wrap spacing={3} py={4} justify={{ base: 'center', md: 'flex-start' }}>
        <MatrixCardSkeleton />
        <MatrixCardSkeleton />
      </Wrap>
    </Flex>
  );
};

export default MatrixPage;
