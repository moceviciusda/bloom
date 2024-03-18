'use client';

import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { IoMenu } from 'react-icons/io5';
import OrganizationPlate from '../_components/organization-plate';

const Dashboard = ({ params }: { params: { organizationSlug: string } }) => (
  <Box flex={1} display='flex' alignItems='center'>
    {/* <HStack display='flex' flex={1} minW={0}> */}
    <Icon as={IoMenu} />
    {/* <Text whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        Dashboard super long text wtf omaigad lets test{params.organizationSlug}
      </Text> */}
    <OrganizationPlate
      organization={{
        id: '1',
        name: 'Dashboard super long text wtf   long text w  long text w  long text w omaigad lets test Organization',
        image: '',
        slug: 'organization',
        ownerId: '1',
      }}
      textProps={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      display='flex'
      flex={1}
      minW={0}
    />
    {/* </HStack> */}
    <Box bg={'red'}>Other stuff.</Box>
  </Box>
);

export default Dashboard;
