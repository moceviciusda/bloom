// import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { CreateOrganization } from '~/app/_components/organization-card/create-organization';
import { getServerAuthSession } from '~/server/auth';
import styles from './index.module.css';
import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import Login from './_components/login-form';
import SignOutButton from './_components/sign-out-button';
import OrganizationCard, {
  CardSkeleton,
} from './_components/organization-card/organization-card';

import { Suspense } from 'react';
import UserPlate from './_components/user-plate';

const Home = async () => {
  // noStore();

  const session = await getServerAuthSession();

  return (
    <Flex align='stretch' minH='100vh' flexDir={{ base: 'column', lg: 'row' }}>
      <Box bg='purple.900' flex={2}>
        <Flex
          direction='column'
          align='center'
          justify='center'
          gap='3rem'
          p={16}
          h={{ base: 'auto', lg: '100vh' }}
          position='sticky'
          top={0}
        >
          <h1 className={styles.title}>
            Someth <span className={styles.pinkSpan}>Bloom</span> Smth
          </h1>
          <div className={styles.cardRow}>
            <Link className={styles.card} href='#'>
              <h3 className={styles.cardTitle}>First Steps →</h3>
              <div className={styles.cardText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                tempora recusandae.
              </div>
            </Link>
            <Link className={styles.card} href='#'>
              <h3 className={styles.cardTitle}>Documentation →</h3>
              <div className={styles.cardText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                tempora recusandae.
              </div>
            </Link>
          </div>
        </Flex>
      </Box>
      <Flex flex={1} justify='center'>
        {!session ? <Login /> : <OrgSelection />}
      </Flex>
    </Flex>
  );
};

const OrgSelection = async () => {
  const session = await getServerAuthSession();
  if (!session) return null;

  return (
    <VStack
      flex={1}
      align='stretch'
      fontSize='sm'
      fontWeight='semibold'
      minW='24rem'
    >
      <HStack
        justify='space-between'
        align='flex-start'
        paddingX={{ base: 4, md: 16, lg: 4, xl: 8 }}
        paddingTop={{ base: 4, xl: 8 }}
        paddingBottom={4}
        position='sticky'
        top={0}
        zIndex={1}
        bg='white'
      >
        <UserPlate
          avatarProps={{ size: 'md' }}
          userNameProps={{ fontSize: 'xl' }}
          userEmailProps={{ lineHeight: undefined }}
          user={session.user}
        />

        <SignOutButton colorScheme='purple' />
      </HStack>

      <VStack
        flex={1}
        justify='center'
        align='stretch'
        gap={3}
        paddingX={{ base: 4, md: 24, lg: 4, xl: 16 }}
      >
        {session.user.organizations
          // sort organizations to show the user's owned orgs first
          .sort((a, b) => {
            if (a.ownerId === session.user.id) return -1;
            if (b.ownerId === session.user.id) return 1;
            return 0;
          })
          .map((org) => (
            <Suspense key={org.id} fallback={<CardSkeleton />}>
              <OrganizationCard
                organization={org}
                isOwner={org.ownerId === session.user.id}
              />
            </Suspense>
          ))}

        <CreateOrganization />
      </VStack>
    </VStack>
  );
};

export default Home;
