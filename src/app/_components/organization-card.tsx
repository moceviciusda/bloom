'use client';

import { Link } from '@chakra-ui/next-js';
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { ImExit } from 'react-icons/im';

import { api } from '~/trpc/react';
import USerPlate from './user-plate';

interface Props {
  organization: Prisma.OrganizationGetPayload<{
    include: { owner: true; members: true };
  }>;
  isOwner: boolean;
}

export const Skeleton: React.FC = ({}) => {
  return (
    <Card size='md' color='blackAlpha.800' minW={320}>
      <CardHeader
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        paddingBottom={0}
      >
        <Heading size='lg'>Loading...</Heading>
      </CardHeader>
      <CardBody paddingTop={0} fontSize='md'>
        <Text>Loading...</Text>
      </CardBody>
    </Card>
  );
};

const OrganizationCard: React.FC<Props> = ({ isOwner, organization }) => {
  const router = useRouter();
  console.log(isOwner);

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

  return (
    <Card
      as={Link}
      href={`/${organization.slug}`}
      size='md'
      color='blackAlpha.800'
      minW={320}
      _hover={{
        boxShadow: '0 0 0 2px #805ad5',
        transform: 'translateY(-4px)',
        textDecor: 'none',
      }}
    >
      <CardHeader
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Heading size='lg'>{organization.name}</Heading>
        <Tooltip
          borderRadius={50}
          label={isOwner ? 'Delete ' : 'Leave '}
          aria-label={isOwner ? 'Delete organization' : 'Leave organization'}
          bg='purple.800'
        >
          <IconButton
            aria-label={isOwner ? 'Delete' : 'Leave'}
            onClick={handleClick}
            icon={isOwner ? <FaTrash /> : <ImExit />}
            isRound
            variant='ghost'
            color='gray.800'
            size={'lg'}
            ml={5}
          />
        </Tooltip>
      </CardHeader>
      <CardBody
        display='flex'
        justifyContent='space-between'
        alignItems='stretch'
        gap={4}
        fontSize='md'
        paddingTop={0}
      >
        <Tooltip
          label='Owner'
          aria-label='Owner'
          placement='bottom-start'
          openDelay={500}
          borderRadius={50}
          bg='purple.800'
        >
          <span>
            <USerPlate user={organization.owner} />
          </span>
        </Tooltip>

        <HStack paddingX={2}>
          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Matrices
            </Text>
            <Text lineHeight={1}>24</Text>
          </VStack>

          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Teams
            </Text>
            <Text lineHeight={1}>4</Text>
          </VStack>

          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Users
            </Text>
            <Text lineHeight={1}>{organization.members.length}</Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default OrganizationCard;
