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
  Heading,
  Stack,
  Stat,
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

const NewMatrixCard = () => {
  return (
    <Card
      variant='hover'
      justify='center'
      size='lg'
      maxW='436px'
      minW='340px'
      flex={1}
    >
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
