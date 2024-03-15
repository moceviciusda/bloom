'use client';

import { Link } from '@chakra-ui/next-js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

interface Props {
  organization: Organization;
}

const OrganizationCard: React.FC<Props> = ({ organization }) => {
  const router = useRouter();

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    deleteOrganization.mutate({ id: organization.id });
  };

  console.log(organization);

  return (
    <Card
      as={Link}
      href={`/${organization.slug}`}
      size='sm'
      _hover={{
        boxShadow: '0 0 0 2px #805ad5',
        // borderColor: '#805ad5',
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
        <Button onClick={handleClick}>X</Button>
      </CardHeader>
      <CardBody>
        <Text fontSize='sm'>Owned by: {organization.owner.name}</Text>
        <Text fontSize='sm'>Members: {organization.members.length || 0}</Text>
        <Text fontSize='sm'>{organization.id}</Text>
      </CardBody>
      {/* <CardFooter as={ButtonGroup}>
        <Button onClick={handleClick}>Delete</Button>
      </CardFooter> */}
    </Card>
  );
};

export default OrganizationCard;
