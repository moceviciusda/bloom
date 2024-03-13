// import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';

import { CreatePost } from '~/app/_components/create-post';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import styles from './index.module.css';
import { Flex, Text } from '@chakra-ui/react';
import Login from './_components/login-form';

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
      <Flex
        flex={1}
        direction='column'
        align='center'
        justify='center'
        gap='3rem'
        // bg='grey'
      >
        <Login />

        {session && (
          <>
            <Text>Logged in as {session.user?.name}</Text>
            <Link href='/api/auth/signout'>Sign out</Link>
          </>
        )}

        <CrudShowcase />
      </Flex>
    </Flex>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div>
      {latestPost ? (
        <p>Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
