'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  type CardProps,
  Divider,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { api } from '~/trpc/react';
import { TbArrowBackUp } from 'react-icons/tb';

export const NewOrganization: React.FC<CardProps> = (props) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [secret, setSecret] = useState('');
  const [joinOpen, setJoinOpen] = useState(false);

  const createOrganization = api.organization.create.useMutation({
    onSuccess: (organization) => {
      // router.refresh();
      setIsOpen(false);
      setName('');
      router.push(`/${organization.slug}/settings`);
    },
  });

  const joinOrg = api.organization.joinBySecret.useMutation({
    onSuccess: (organization) => {
      // router.refresh();
      setJoinOpen(false);
      setSecret('');
      router.push(`/${organization.slug}`);
    },
  });

  const nameInputError =
    createOrganization.error?.data?.zodError?.fieldErrors?.name?.[0];

  return (
    <Card size='md' color='blackAlpha.900' {...props}>
      {isOpen ? (
        <>
          <CardHeader
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            paddingBottom={3}
          >
            <FormControl isInvalid={createOrganization.isError}>
              <FormErrorMessage fontWeight='500' mt={0}>
                {nameInputError}
              </FormErrorMessage>

              <Input
                autoFocus
                variant='unstyled'
                fontSize='1.65rem'
                fontWeight='bold'
                placeholder='Organization Name'
                _placeholder={{ fontSize: '20', fontWeight: '500' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    createOrganization.mutate({ name: name.trim() });
                  }
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
              />
            </FormControl>
            <IconButton
              aria-label='cancel'
              icon={<TbArrowBackUp />}
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
              isLoading={createOrganization.isLoading}
              colorScheme='purple'
              onClick={() => createOrganization.mutate({ name: name.trim() })}
              isDisabled={!name.trim()}
            >
              Submit
            </Button>
          </CardBody>
        </>
      ) : joinOpen ? (
        <>
          <CardHeader
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            paddingBottom={3}
          >
            <FormControl isInvalid={joinOrg.isError}>
              <FormErrorMessage fontWeight='500' mt={0}>
                {joinOrg.error?.message}
              </FormErrorMessage>
              <Input
                variant='unstyled'
                autoFocus
                _focusVisible={{ outline: 'none' }}
                placeholder='Organization Secret'
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    joinOrg.mutate({ secret });
                  }
                  if (e.key === 'Escape') {
                    setJoinOpen(false);
                  }
                }}
              />
            </FormControl>
            <IconButton
              aria-label='cancel'
              icon={<TbArrowBackUp />}
              variant='ghost'
              color='gray.800'
              size={'lg'}
              onClick={(e) => {
                e.stopPropagation();
                setJoinOpen(false);
              }}
            />
          </CardHeader>

          <CardBody paddingTop={0}>
            <Button
              w='100%'
              isLoading={joinOrg.isLoading}
              colorScheme='purple'
              onClick={() => joinOrg.mutate({ secret })}
              isDisabled={!secret.trim()}
            >
              Join
            </Button>
          </CardBody>
        </>
      ) : (
        <CardBody as={VStack} gap={0.5} align='stretch'>
          <Button
            onClick={() => {
              setName('');
              setIsOpen(true);
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
            onClick={() => {
              setSecret('');
              setJoinOpen(true);
            }}
          >
            Join an existing one
          </Button>
        </CardBody>
      )}
    </Card>
  );
};
