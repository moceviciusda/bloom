import { Heading } from '@chakra-ui/react';

interface TeamsLayoutProps {
  children: React.ReactNode;
  params: { organizationSlug: string };
}

const TeamsLayout: React.FC<TeamsLayoutProps> = ({ children }) => {
  return (
    <>
      <Heading p={6}>Teams</Heading>
      {children}
    </>
  );
};

export default TeamsLayout;
