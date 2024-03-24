import { Divider, Flex, Heading } from '@chakra-ui/react';

interface MatrixLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const MatrixLayout: React.FC<MatrixLayoutProps> = ({ children }) => {
  return (
    <Flex flex={1} p={3} flexDir='column'>
      <Heading size='lg' mb={3}>
        Matrix
      </Heading>
      <Divider />
      {children}
    </Flex>
  );
};

export default MatrixLayout;
