'use client';

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
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

  const handleClick = () => deleteOrganization.mutate({ id: organization.id });

  return (
    <Card size='sm'>
      <CardHeader>
        <Heading size='md'>{organization.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text fontSize='sm'>{organization.id}</Text>
      </CardBody>
      <CardFooter as={ButtonGroup}>
        <Button
          onClick={() => {
            router.push(`/${organization.slug}`);
          }}
          flex={1}
        >
          Continue
        </Button>
        <Button onClick={handleClick}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;
