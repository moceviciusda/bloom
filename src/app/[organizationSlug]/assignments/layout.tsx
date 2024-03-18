import { Heading } from '@chakra-ui/react';

interface AssignmentsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const AssignmentsLayout: React.FC<AssignmentsLayoutProps> = ({ children }) => {
  return (
    <>
      <Heading p={6}>Assignments</Heading>
      {children}
    </>
  );
};

export default AssignmentsLayout;
