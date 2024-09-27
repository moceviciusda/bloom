import {
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Text,
  Link,
  HStack,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { authOptions } from '~/server/auth';
import OauthButton from './oauth-button';

const Login: React.FC = ({}) => {
  return (
    <VStack flex={1} alignItems='center' justifyContent='center'>
      <VStack
        gap={3}
        align='stretch'
        fontSize='sm'
        justify='center'
        maxW='lg'
        p={{ base: 4, sm: 8, md: 16 }}
      >
        <Heading size='2xl'>Sign In</Heading>
        <Text fontSize='sm'>
          New to Bloom? <Link href='#'>Sign up for an account</Link>
        </Text>
        <FormControl isRequired>
          <Input
            id='email'
            size='lg'
            type='email'
            placeholder='Enter your email'
          />
        </FormControl>
        <Tooltip label='Coming soon! Use social login for now' variant='bloom'>
          <Button
            size='lg'
            as='a'
            href='/api/auth/signin'
            colorScheme='purple'
            isDisabled
          >
            Sign in with Email
          </Button>
        </Tooltip>
        <HStack>
          <Divider />
          <Text as='span' fontSize='sm' whiteSpace='nowrap' fontWeight='300'>
            or continue with
          </Text>
          <Divider />
        </HStack>
        <HStack gap={2}>
          {authOptions.providers.map((provider) => {
            return (
              <OauthButton
                key={provider.id}
                providerId={provider.id}
                providerName={provider.name}
                // variant='outline'
                size='lg'
                fontSize={{ base: 'sm', sm: 'md' }}
                colorScheme='purple'
                flex={1}
                paddingX={4}
              />
            );
          })}
        </HStack>
        <Text fontSize='sm' textAlign='center'>
          By signing in, you agree to our <Link href='#'>Terms of Service</Link>{' '}
          and <Link href='#'>Privacy Policy</Link>.
        </Text>
      </VStack>
    </VStack>
  );
};

export default Login;
