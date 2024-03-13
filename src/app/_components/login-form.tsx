import {
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
} from '@chakra-ui/react';
import { authOptions } from '~/server/auth';
import OauthButton from './oauth-button';

const Login: React.FC = ({}) => {
  return (
    <VStack
      gap={2}
      align='flex-start'
      fontSize='sm'
      fontWeight='semibold'
      minW='24rem'
      p={8}
    >
      <Heading>Log In</Heading>
      <Text>
        New to Bloom? <Link href='#'>Sign up for an account</Link>
      </Text>
      <FormControl isRequired>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input id='email' type='email' placeholder='Enter your email' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <Input
          id='password'
          type='password'
          placeholder='Enter your password'
        />
        <Text align='end'>
          <Link href='#'>Forgot Password?</Link>
        </Text>
      </FormControl>

      <Button as='a' href='/api/auth/signin' colorScheme='purple' w='100%'>
        Sign in
      </Button>

      <Text alignSelf='center'>- OR -</Text>
      {authOptions.providers.map((provider) => (
        <OauthButton
          key={provider.id}
          provider={provider.id}
          variant='outline'
          size='md'
          colorScheme='purple'
          w='100%'
        />
      ))}
    </VStack>
  );
};

export default Login;
