import {
  Avatar,
  AvatarGroup,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { type Matrix } from '@prisma/client';

export const MatrixStats = async ({ matrix }: { matrix: Matrix }) => {
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
    <HStack
      flex={1}
      justifyContent='space-between'
      alignItems='stretch'
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
    </HStack>
  );
};
