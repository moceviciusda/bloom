import { Divider, Flex, Heading, Wrap } from '@chakra-ui/react';
import { api } from '~/trpc/server';
import MatrixCard from './_matrix-card/matrix-card';
import NewMatrixCard from './_matrix-card/new-matrix';

const MatrixPage = async ({
  params,
}: {
  params: { organizationSlug: string };
}) => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        My Matrices
      </Heading>
      <Divider />

      <MyMatrices orgSlug={params.organizationSlug} />

      <Heading size='lg' mb={3}>
        Shared with me
      </Heading>
      <Divider />

      <SharedMatrices orgSlug={params.organizationSlug} />
    </Flex>
  );
};

const MyMatrices = async ({ orgSlug }: { orgSlug: string }) => {
  const matrices = await api.matrix.getOwned.query({
    organizationSlug: orgSlug,
  });

  return (
    <Wrap spacing={3} py={4} justify={{ base: 'center', md: 'flex-start' }}>
      {matrices.map((matrix) => (
        <MatrixCard key={matrix.id} matrix={matrix} />
      ))}

      <NewMatrixCard orgSlug={orgSlug} />
    </Wrap>
  );
};

const SharedMatrices = async ({ orgSlug }: { orgSlug: string }) => {
  const matrices = await api.matrix.getShared.query({
    organizationSlug: orgSlug,
  });

  return (
    <Wrap spacing={3} py={4} justify={{ base: 'center', md: 'flex-start' }}>
      {matrices.map((matrix) => (
        <MatrixCard key={matrix.id} matrix={matrix} />
      ))}
    </Wrap>
  );
};

export default MatrixPage;
