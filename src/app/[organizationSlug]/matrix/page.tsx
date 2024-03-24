import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  Wrap,
} from '@chakra-ui/react';
import { MdDelete, MdEdit, MdShare, MdViewAgenda } from 'react-icons/md';

const MatrixPage = ({ params }: { params: { organizationSlug: string } }) => {
  return (
    <Stack gap={4}>
      <Heading size='md'>My Matrices</Heading>
      <Wrap spacing={3}>
        <PlaceholderMatrix />

        <NewMatrixCard />
      </Wrap>

      <Divider />

      <Heading size='md'>Shared with me</Heading>
      <Wrap spacing={3}>
        <PlaceholderMatrix />
        <PlaceholderMatrix />
      </Wrap>
    </Stack>
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
    <Card variant='hover' fontSize={14} size='lg'>
      <CardHeader>
        <Heading size='lg'>Placeholder Matrix</Heading>
      </CardHeader>

      <CardBody py={0} gap={2}>
        <StatGroup textAlign='center'>
          <Stat>
            <StatLabel>Assignees</StatLabel>
            <StatNumber>
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
            <StatNumber>22</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber>13</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Average</StatLabel>
            <StatNumber>72%</StatNumber>
          </Stat>
        </StatGroup>
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

const NewMatrixCard = () => {
  return (
    <Card variant='hover' justify='center' size='lg' minW='436px'>
      <CardBody
        display='flex'
        justifyContent='center'
        flexDirection='column'
        textAlign='center'
        fontSize={28}
        fontWeight='600'
      >
        <Text>Create a new matrix</Text>
        <Text>+</Text>
      </CardBody>
    </Card>
  );
};

export default MatrixPage;
