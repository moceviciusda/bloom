// import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { CreateOrganization } from '~/app/_components/create-organization';
import { getServerAuthSession } from '~/server/auth';
import styles from './index.module.css';
import { Flex, Text, VStack } from '@chakra-ui/react';
import Login from './_components/login-form';
import SignOutButton from './_components/sign-out-button';
import OrganizationCard from './_components/organization-card';
// import { signOut } from 'next-auth/react';

export default async function Home() {
  // noStore();
  const session = await getServerAuthSession();

  return (
    <Flex align='stretch' justify='center' minH='100vh'>
      <Flex
        flex={1.5}
        direction='column'
        align='center'
        justify='center'
        gap='3rem'
        p='4rem 1rem'
        bg='purple.900'
      >
        <h1 className={styles.title}>
          Create <span className={styles.pinkSpan}>Bloom</span> App
        </h1>
        <div className={styles.cardRow}>
          <Link
            className={styles.card}
            href='https://create.t3.gg/en/usage/first-steps'
            target='_blank'
          >
            <h3 className={styles.cardTitle}>First Steps →</h3>
            <div className={styles.cardText}>
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className={styles.card}
            href='https://create.t3.gg/en/introduction'
            target='_blank'
          >
            <h3 className={styles.cardTitle}>Documentation →</h3>
            <div className={styles.cardText}>
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
      </Flex>
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

      <VStack flex={1} gap={3} justify='center' align='stretch' fontSize='sm'>
        {session.user.organizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
        <CreateOrganization />
      </VStack>
    </VStack>
  );
}
