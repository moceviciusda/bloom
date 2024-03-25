'use client';

import { Card, CardBody, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const NewMatrixCard = ({ orgSlug }: { orgSlug: string }) => {
  const router = useRouter();

  const createMatrix = api.matrix.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card
      variant='hover'
      justify='center'
      size='lg'
      maxW='436px'
      minW='340px'
      flex={1}
      cursor='pointer'
      onClick={() => createMatrix.mutate({ orgSlug, name: 'New Matrix' })}
    >
      <CardBody
        display='flex'
        justifyContent='center'
        flexDirection='column'
        textAlign='center'
        fontSize={28}
        fontWeight='600'
      >
        <Text>Create a new matrix</Text>
        <Text>+</Text>
      </CardBody>
    </Card>
  );
};

export default NewMatrixCard;
