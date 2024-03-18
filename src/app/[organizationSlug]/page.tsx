'use client';

import { Box, Text } from '@chakra-ui/react';

const Dashboard = ({ params }: { params: { organizationSlug: string } }) => (
  <Box flex={1} display='flex' alignItems='center'>
    <Text>Welcome to the dashboard of {params.organizationSlug}</Text>
  </Box>
);

export default Dashboard;
