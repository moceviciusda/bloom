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

  return (
    <Card size='md' color='blackAlpha.900' h='140px' {...props}>
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
              onClick={() => createOrganization.mutate({ name })}
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
            <Input
              autoFocus
              type='text'
              variant='unstyled'
              fontSize='1.65rem'
              fontWeight='bold'
              placeholder='Organization Secret'
              _placeholder={{ fontSize: '20', fontWeight: '500' }}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
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
            >
              Join
            </Button>
          </CardBody>
        </>
      ) : (
        <CardBody as={VStack} gap={0.5} align='stretch'>
          <Button
            flex={1}
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
            flex={1}
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
