import { Divider, Flex, Heading } from '@chakra-ui/react';

interface AssignmentsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const AssignmentsLayout: React.FC<AssignmentsLayoutProps> = ({ children }) => {
  return (
    <Flex p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Assignments
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default AssignmentsLayout;
