'use client';

import { Divider, Flex, Heading } from '@chakra-ui/react';

const Dashboard = ({ params }: { params: { organizationSlug: string } }) => (
  <Flex p={3} flexDir='column'>
    <Heading size='lg' mb={3}>
      Dashboard
    </Heading>
    <Divider />
  </Flex>
);

export default Dashboard;
