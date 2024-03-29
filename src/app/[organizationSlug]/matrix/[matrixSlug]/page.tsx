import { Flex } from '@chakra-ui/react';
import { api } from '~/trpc/server';
import { MatrixView } from './_matrix-view/matrix-view';
import { getServerAuthSession } from '~/server/auth';

const MatrixPage = async ({
  params,
}: {
  params: { organizationSlug: string; matrixSlug: string };
}) => {
  const session = await getServerAuthSession();

  const fullMatrix = await api.matrix.getFullBySlug.query({
    orgSlug: params.organizationSlug,
    matrixSlug: params.matrixSlug,
  });

  if (!fullMatrix || !session) {
    return null;
  }

  const isEditable = fullMatrix.users.some(
    (user) => user.user.id === session.user.id && user.permissions !== 'VIEWER'
  );

  return (
    <Flex flex={1} p={3} flexDir='column'>
      <MatrixView matrix={fullMatrix} isEditable={isEditable} />
    </Flex>
  );
};

export default MatrixPage;
