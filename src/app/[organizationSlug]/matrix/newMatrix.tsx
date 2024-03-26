'use client';

import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { api } from '~/trpc/react';

const NewMatrixCard = ({ orgSlug }: { orgSlug: string }) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');

  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => {
      setName('');
      onClose();
    },
  });

  const createMatrix = api.matrix.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName('');
      onClose();
    },
  });

  const nameInputError =
    createMatrix.error?.data?.zodError?.fieldErrors?.name?.[0];

  const submitHandler = () =>
    createMatrix.mutate({ name: name.trim(), orgSlug });

  return (
    <Card
      ref={ref}
      variant={isOpen ? 'elevated' : 'hover'}
      justify='center'
      size='lg'
      maxW='436px'
      minW='340px'
      flex={1}
      transition='all 0.2s ease-in-out'
    >
      <CardBody
        display='flex'
        justifyContent='center'
        flexDirection='column'
        textAlign='center'
        fontSize={28}
        fontWeight='600'
        onClick={onOpen}
        cursor='pointer'
      >
        {!isOpen ? (
          <>
            <Text>Create a new matrix</Text>
            <Text>+</Text>
          </>
        ) : (
          <VStack align='stretch'>
            <FormControl isInvalid={!!nameInputError}>
              <FormErrorMessage>{nameInputError}</FormErrorMessage>
              <Input
                _focusVisible={{ outline: 'none' }}
                placeholder='Matrix name'
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    submitHandler();
                  }

                  if (e.key === 'Escape') {
                    onClose();
                  }
                }}
              />
            </FormControl>
            <Button
              isLoading={createMatrix.isLoading}
              isDisabled={!!!name.trim()}
              colorScheme='purple'
              size='md'
              onClick={submitHandler}
            >
              Create Matrix
            </Button>
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

export default NewMatrixCard;
