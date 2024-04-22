import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { type Matrix } from '@prisma/client';
import Link from 'next/link';
import { MatrixCardControls } from './controls';
import { MatrixStats, MatrixStatsSkeleton } from './stats';

export const MatrixCard: React.FC<{ matrix: Matrix; isOwner?: boolean }> = ({
  matrix,
  isOwner = false,
}) => {
  return (
    <Card
      as={Link}
      href={`/${matrix.organizationSlug}/matrix/${matrix.slug}`}
      variant='hover'
      fontSize={14}
      size={{ base: 'md', md: 'lg' }}
      maxW='400px'
      borderRadius={16}
    >
      <CardHeader>
        <Heading size='lg'>{matrix.name}</Heading>
      </CardHeader>

      <CardBody py={0} display='flex' alignItems='flex-end'>
        <MatrixStats matrix={matrix} />
      </CardBody>

      <CardFooter p={6}>
        <MatrixCardControls matrix={matrix} isOwner={isOwner} />
      </CardFooter>
    </Card>
  );
};

export const MatrixCardSkeleton: React.FC = () => {
  return (
    <Card size={{ base: 'md', md: 'lg' }} maxW='400px'>
      <CardHeader>
        <Skeleton h={8} w='280px' borderRadius={6} />
      </CardHeader>

      <CardBody py={0} display='flex' alignItems='flex-end'>
        <MatrixStatsSkeleton />
      </CardBody>

      <CardFooter p={6}>
        <Skeleton h={8} w='352px' borderRadius={6} />
      </CardFooter>
    </Card>
  );
};
