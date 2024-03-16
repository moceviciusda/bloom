// import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { CreateOrganization } from '~/app/_components/create-organization';
import { getServerAuthSession } from '~/server/auth';
import styles from './index.module.css';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import Login from './_components/login-form';
import SignOutButton from './_components/sign-out-button';
import OrganizationCard, { Skeleton } from './_components/organization-card';
// import { signOut } from 'next-auth/react';

export default async function Home() {
  // noStore();
  const session = await getServerAuthSession();

  return (
    <Flex align='stretch' justify='center' minH='100vh'>
      <Box bg='purple.900' flex={1.5}>
        <Flex
          direction='column'
          align='center'
          justify='center'
          gap='3rem'
          p='4rem 1rem'
          h='100vh'
          position='sticky'
          top={0}
        >
          <h1 className={styles.title}>
            Someth <span className={styles.pinkSpan}>Bloom</span> Smth
          </h1>
          <div className={styles.cardRow}>
            <Link
              className={styles.card}
              href='https://create.t3.gg/en/usage/first-steps'
              target='_blank'
            >
              <h3 className={styles.cardTitle}>First Steps →</h3>
              <div className={styles.cardText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                tempora recusandae.
              </div>
            </Link>
            <Link
              className={styles.card}
              href='https://create.t3.gg/en/introduction'
              target='_blank'
            >
              <h3 className={styles.cardTitle}>Documentation →</h3>
              <div className={styles.cardText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                tempora recusandae.
              </div>
            </Link>
          </div>
        </Flex>
      </Box>
      <Flex flex={1} direction='column' align='center' justify='center'>
        {!session ? <Login /> : <CrudShowcase />}
      </Flex>
    </Flex>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <VStack
      flex={1}
      fontSize='sm'
      fontWeight='semibold'
      minW='24rem'
      paddingX={8}
    >
      <Text justifySelf='flex-start'>Logged in as {session.user?.name}</Text>
      <SignOutButton colorScheme='purple' />

      <VStack gap={3} align='stretch' fontSize='sm'>
        {session.user.organizations
          // sort organizations to show the user's owned orgs first
          .sort((a, b) => {
            if (a.owner.id === session.user.id) return -1;
            if (b.owner.id === session.user.id) return 1;
            return 0;
          })
          .map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              isOwner={org.owner.id === session.user.id}
            />
          ))}
        <Skeleton />
        <CreateOrganization />
      </VStack>
    </VStack>
  );
}
