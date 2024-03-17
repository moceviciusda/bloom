'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { api } from '~/trpc/react';
import { FaTimes } from 'react-icons/fa';

export const CreateOrganization = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const createOrganization = api.organization.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsOpen(false);
      setName('');
    },
  });

  return (
    <Card
      as={isOpen ? 'form' : undefined}
      size='md'
      color='blackAlpha.900'
      h='140px'
      onSubmit={(e) => {
        e.preventDefault();
        createOrganization.mutate({ name });
      }}
    >
      {isOpen ? (
        <>
          <CardHeader
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            paddingBottom={3}
          >
            <Input
              autoFocus
              type='text'
              variant='unstyled'
              fontSize='1.65rem'
              fontWeight='bold'
              placeholder='Organization Name'
              _placeholder={{ fontSize: '20', fontWeight: '500' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IconButton
              aria-label='cancel'
              icon={<FaTimes />}
              variant='ghost'
              color='gray.800'
              size={'lg'}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
          </CardHeader>
          <CardBody paddingTop={0}>
            <Button
              w='100%'
              type='submit'
              // size='sm'
              isLoading={createOrganization.isLoading}
              disabled={createOrganization.isLoading}
              colorScheme='purple'
              onClick={(e) => e.stopPropagation()}
            >
              Submit
            </Button>
          </CardBody>
        </>
      ) : (
        <CardBody as={VStack} gap={0.5} align='stretch'>
          <Button
            flex={1}
            onClick={() => {
              setIsOpen(true);
              setName('');
            }}
          >
            Create a new organization
          </Button>
          <HStack>
            <Divider />
            <Text as='span' fontSize='sm' whiteSpace='nowrap' fontWeight='300'>
              or
            </Text>
            <Divider />
          </HStack>
          <Button
            colorScheme='purple'
            flex={1}
            onClick={() => {
              // setIsOpen(true);
              // setName('');
            }}
          >
            Join an existing one
          </Button>
        </CardBody>
      )}
    </Card>
  );
};
