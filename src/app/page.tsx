import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { NewOrganization } from '~/app/_components/organization-card/new-organization';
import { getServerAuthSession } from '~/server/auth';
import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Login from './_components/login/login-form';
import SignOutButton from './_components/sign-out-button';
import OrganizationCard, {
  CardSkeleton,
} from './_components/organization-card/organization-card';

import { Suspense } from 'react';
import UserPlate from './_components/user-plate';
import Brand from './_components/brand';
import GradientBg from './_components/gradient-bg';
import LandingNavbar from './_components/landing-navbar';
import CtaArrow from './_components/cta-arrow';

const Home = async () => {
  noStore();

  const session = await getServerAuthSession();

  return (
    <Flex
      alignItems='stretch'
      minH='100vh'
      flexDir={{ base: 'column', xl: 'row' }}
    >
      <GradientBg
        flex={2}
        display='flex'
        animationProps={{
          // bgColor:
          //   'linear-gradient(160deg, var(--chakra-colors-gray-900) 0%, var(--chakra-colors-purple-900) 40%, var(--chakra-colors-purple-200) 100%)',
          bgColor:
            'linear-gradient(40deg, var(--chakra-colors-purple-800), rgb(0, 17, 82))',
          // color1:
          //   'radial-gradient(circle at center, hsl(from var(--chakra-colors-purple-600) h s l / .8) 0, hsl(from var(--chakra-colors-purple-600) h s l / 0) 50%) no-repeat',
          // color2:
          //   'radial-gradient(circle at center, hsl(from var(--chakra-colors-blue-700) h s l / .8) 0, hsl(from var(--chakra-colors-blue-700) h s l / 0) 50%) no-repeat',
          // color3:
          //   'radial-gradient(circle at center, hsl(from var(--chakra-colors-teal-600) h s l / .8) 0, hsl(from var(--chakra-colors-teal-600) h s l / 0) 50%) no-repeat',
          // color4:
          //   'radial-gradient(circle at center, hsl(from var(--chakra-colors-pink-500) h s l / .8) 0, hsl(from var(--chakra-colors-pink-500) h s l / 0) 50%) no-repeat',
          circleSize: '100%',
          color5:
            'radial-gradient(circle at center, hsl(from var(--chakra-colors-red-500) h s l / .8) 0, hsl(from var(--chakra-colors-pink-500) h s l / 0) 50%) no-repeat',
        }}
      >
        <Flex
          direction='column'
          flex={1}
          gap={12}
          p={{ base: 4, sm: 8, md: 16 }}
          h={{ base: 'auto', xl: '100vh' }}
          position='sticky'
          justifyContent='space-between'
          top={0}
        >
          <HStack align='center' justify='space-between'>
            <Brand as='span' fontSize={60} color='purple.300' />
            <LandingNavbar />
          </HStack>
          <VStack align='stretch' gap={4}>
            <Heading
              fontSize={{ base: 24, sm: 32, md: 48, '2xl': 80 }}
              fontWeight={600}
              color='white'
              maxW='5xl'
            >
              Empower your team to reach their full potential.
            </Heading>
            <Text
              fontSize={{ base: 16, md: 18 }}
              color='whiteAlpha.800'
              maxW='3xl'
            >
              Easily create tailored competence evaluation matrices, track
              progress, and foster a culture of growth and development.
            </Text>

            <Button
              mt={4}
              display={{ base: 'block', xl: 'none' }}
              size='lg'
              minW={{ base: 'full', sm: 'unset' }}
              alignSelf='flex-end'
            >
              Try it out for free today!
            </Button>
            <CtaArrow
              mt={{ base: 10, '2xl': 4 }}
              alignSelf='flex-end'
              display={{ base: 'none', xl: 'block' }}
            />
          </VStack>
          <Link href='/pricing'>
            <Text
              fontSize={18}
              color='whiteAlpha.800'
              maxW='lg'
              textDecoration='underline'
            >
              Learn more about our pricing
            </Text>
          </Link>
        </Flex>
      </GradientBg>

      {!session ? <Login /> : <OrgSelection />}
    </Flex>
  );
};

const OrgSelection = async () => {
  const session = await getServerAuthSession();
  if (!session) return null;

  return (
    <VStack flex={1} p={0} gap={0} align='stretch'>
      <HStack
        justify='space-between'
        // align='flex-start'
        borderBottom='1px solid var(--chakra-colors-chakra-border-color)'
        // paddingX={{ base: 4, md: 16, lg: 4, xl: 8 }}
        // paddingTop={{ base: 4, xl: 8 }}
        padding={4}
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

        <SignOutButton colorScheme='purple'>Sign Out</SignOutButton>
      </HStack>

      <VStack
        flex={1}
        align='stretch'
        fontSize='sm'
        fontWeight='semibold'
        minW='24rem'
        p={{ base: 4, md: 6, lg: 4, '2xl': 6 }}
      >
        <VStack
          flex={1}
          justify='center'
          align='stretch'
          gap={3}
          paddingX={{ base: 0, sm: 4, md: 24, lg: 0, '2xl': 8 }}
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

          <NewOrganization variant='hover' />
        </VStack>
      </VStack>
    </VStack>
  );
};

export default Home;
