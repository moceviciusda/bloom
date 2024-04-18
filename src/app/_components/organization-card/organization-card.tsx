import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { type Organization } from '@prisma/client';
import UserPlate from '../user-plate';
import { api } from '~/trpc/server';
import { LeaveOrgButton } from './leave-remove-org';
import { DeleteOrganizationModal } from '../../[organizationSlug]/settings/_sections/danger-zone';
import { MdDelete } from 'react-icons/md';

interface Props {
  organization: Organization;
  isOwner: boolean;
}

export const CardSkeleton: React.FC = () => {
  return (
    <Card size='md' color='blackAlpha.800'>
      <CardHeader
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        gap={4}
      >
        <Skeleton flex={1} h='36px' />
        <SkeletonCircle size='10' />
      </CardHeader>
      <CardBody
        display='flex'
        justifyContent='space-between'
        alignItems='stretch'
        gap={4}
        fontSize='md'
        paddingTop={0}
      >
        <HStack>
          <SkeletonCircle size='8' />
          <SkeletonText w='184px' noOfLines={2} />
        </HStack>

        <Skeleton flex={1} />
      </CardBody>
    </Card>
  );
};

const OrganizationCard: React.FC<Props> = async ({ organization, isOwner }) => {
  const org = await api.organization.getById.query({ id: organization.id });

  if (!org) return null;

  return (
    <Card
      as={Link}
      href={`/${organization.slug}`}
      variant='hover'
      size='md'
      color='blackAlpha.800'
    >
      <CardHeader
        display='flex'
        alignItems='flex-start'
        justifyContent='space-between'
      >
        <HStack>
          {org.image && <Avatar src={org.image} size='md' />}
          <Heading size='lg' color='blackAlpha.800'>
            {organization.name}
          </Heading>
        </HStack>
        {isOwner ? (
          <Tooltip borderRadius={5} label='Delete ' bg='blackAlpha.700'>
            <span>
              <DeleteOrganizationModal
                organization={organization}
                size='lg'
                variant='ghost'
                colorScheme='gray'
                p={0}
              >
                <MdDelete />
              </DeleteOrganizationModal>
            </span>
          </Tooltip>
        ) : (
          // <RemoveOrgButton organizationId={organization.id} />
          <LeaveOrgButton organizationId={organization.id} />
        )}
      </CardHeader>
      <CardBody
        display='flex'
        justifyContent='space-between'
        alignItems='stretch'
        flexWrap='wrap'
        gap={4}
        fontSize='md'
        paddingTop={0}
      >
        <Tooltip
          label='Owner'
          aria-label='Owner'
          placement='bottom-start'
          openDelay={500}
          variant='bloom'
        >
          <span>
            <UserPlate user={org.owner} />
          </span>
        </Tooltip>

        <HStack paddingX={2}>
          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Matrices
            </Text>
            <Text lineHeight={1}>{org._count.matrices}</Text>
          </VStack>

          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Teams
            </Text>
            <Text lineHeight={1}>0</Text>
          </VStack>

          <VStack justify='center' gap={0}>
            <Text lineHeight={1} fontSize='xs'>
              Users
            </Text>
            <Text lineHeight={1}>{org._count.members}</Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default OrganizationCard;
