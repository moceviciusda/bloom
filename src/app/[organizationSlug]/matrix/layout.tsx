import { Heading } from '@chakra-ui/react';

interface MatrixLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const MatrixLayout: React.FC<MatrixLayoutProps> = ({ children }) => {
  return (
    <>
      <Heading p={6}>Matrix</Heading>
      {children}
    </>
  );
};

export default MatrixLayout;
