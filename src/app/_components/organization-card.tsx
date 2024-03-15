'use client';

import { Link } from '@chakra-ui/next-js';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';

import { api } from '~/trpc/react';

interface Props {
  organization: Prisma.OrganizationGetPayload<{
    include: { owner: true; members: true };
  }>;
}

const OrganizationCard: React.FC<Props> = ({ organization }) => {
  const router = useRouter();

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeUser = api.organization.removeUser.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    isOwner
      ? deleteOrganization.mutate({ id: organization.id })
      : removeUser.mutate({ id: organization.id });
  };

  const { data: session, status } = useSession();

  if (status === 'loading') return <Text>Loading...</Text>;
  if (!session) return redirect('/');

  const isOwner = session.user.id === organization.owner.id;

  return (
    <Card
      as={Link}
      href={`/${organization.slug}`}
      size='sm'
      _hover={{
        boxShadow: '0 0 0 2px #805ad5',
        transform: 'translateY(-4px)',
        textDecor: 'none',
      }}
    >
      <CardHeader
        display='flex'
        dir='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Heading size='md'>{organization.name}</Heading>
        <IconButton
          aria-label={isOwner ? 'Delete' : 'Leave'}
          onClick={handleClick}
          icon={isOwner ? <FaTrash /> : <RxExit />}
          isRound
          variant='ghost'
        />
      </CardHeader>
      <CardBody>
        <Text fontSize='sm'>Owned by: {organization.owner.name}</Text>
        <Text fontSize='sm'>Members: {organization.members.length || 0}</Text>
        <Text fontSize='sm'>{organization.id}</Text>
      </CardBody>
    </Card>
  );
};

export default OrganizationCard;
