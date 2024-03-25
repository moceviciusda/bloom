import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  Wrap,
} from '@chakra-ui/react';
import { MdDelete, MdEdit, MdShare, MdViewAgenda } from 'react-icons/md';
import { api } from '~/trpc/server';
import MatrixCard from './matrixCard';
import NewMatrixCard from './newMatrix';

const MatrixPage = async ({
  params,
}: {
  params: { organizationSlug: string };
}) => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        My Matrices
      </Heading>
      <Divider />

      <MyMatrices orgSlug={params.organizationSlug} />

      <Heading size='lg' mb={3}>
        Shared with me
      </Heading>
      <Divider />

      <SharedMatrices orgSlug={params.organizationSlug} />
    </Flex>
  );
};

const MyMatrices = async ({ orgSlug }: { orgSlug: string }) => {
  const matrices = await api.matrix.getOwned.query({
    organizationSlug: orgSlug,
  });

  return (
    <Wrap spacing={3} py={4}>
      {matrices.map((matrix) => (
        <MatrixCard key={matrix.id} matrix={matrix} />
      ))}

      <NewMatrixCard orgSlug={orgSlug} />
    </Wrap>
  );
};

const SharedMatrices = async ({ orgSlug }: { orgSlug: string }) => {
  const matrices = await api.matrix.getShared.query({
    organizationSlug: orgSlug,
  });

  return (
    <Wrap spacing={3} py={4}>
      <PlaceholderMatrix />
      {matrices.map((matrix) => (
        <MatrixCard key={matrix.id} matrix={matrix} />
      ))}
    </Wrap>
  );
};

const PlaceholderMatrix = () => {
  const assignees = [
    'Segun Adebayo',
    'Prosper Otemuyiwa',
    'Lindsey Kopacz',
    'Kent Dodds',
    'Ryan Florence',
    'Christian Nwamba',
    'Lucas Nhamburo',
    'Lauren Tran',
    'Tolu Agunbiade',
  ];

  return (
    <Card variant='hover' fontSize={14} size={{ base: 'md', md: 'lg' }}>
      <CardHeader>
        <Heading size='lg'>Placeholder Matrix</Heading>
      </CardHeader>

      <CardBody
        py={0}
        display='flex'
        flexDir='row'
        justifyContent='space-between'
        alignItems='stretch'
        gap={2}
        textAlign='center'
      >
        <Stat>
          <StatLabel>Assignees</StatLabel>
          <StatNumber py={2}>
            <Tooltip
              variant='bloom'
              openDelay={500}
              label={assignees.map((assignee) => (
                <Text key={assignee}>{assignee}</Text>
              ))}
              aria-label='Assignees'
            >
              <AvatarGroup size='sm' max={3} justifyContent='center'>
                {assignees.map((assignee) => (
                  <Avatar key={assignee} name={assignee} />
                ))}
              </AvatarGroup>
            </Tooltip>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Assigned</StatLabel>
          <StatNumber py={2}>22</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Completed</StatLabel>
          <StatNumber py={2}>13</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Average</StatLabel>
          <CircularProgress size='48px' value={68} color='purple.500'>
            <CircularProgressLabel>
              <StatNumber fontSize={20}>65</StatNumber>
            </CircularProgressLabel>
          </CircularProgress>
        </Stat>
      </CardBody>

      <CardFooter as={ButtonGroup} isAttached colorScheme='purple' p={6}>
        <Button leftIcon={<MdViewAgenda />}>View</Button>
        <Button leftIcon={<MdEdit />}>Edit</Button>
        <Button leftIcon={<MdShare />}>Share</Button>
        <Button leftIcon={<MdDelete />}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default MatrixPage;
