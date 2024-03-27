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
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { type Matrix } from '@prisma/client';
import Link from 'next/link';
import { MdViewAgenda, MdEdit, MdShare, MdDelete } from 'react-icons/md';
import { MatrixCardControls } from './controls';

const MatrixCard: React.FC<{ matrix: Matrix }> = ({ matrix }) => {
  return (
    <Card
      as={Link}
      href={`/${matrix.organizationSlug}/matrix/${matrix.slug}`}
      variant='hover'
      fontSize={14}
      size={{ base: 'md', md: 'lg' }}
      maxW='420px'
    >
      <CardHeader>
        <Heading size='lg'>{matrix.name}</Heading>
      </CardHeader>

      <MatrixStats matrix={matrix} />

      <CardFooter p={6}>
        <MatrixCardControls matrix={matrix} />
      </CardFooter>
    </Card>
  );
};

const MatrixStats = async ({ matrix }: { matrix: Matrix }) => {
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
  );
};

export default MatrixCard;
