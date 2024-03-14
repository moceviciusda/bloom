import {
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { authOptions } from '~/server/auth';
import OauthButton from './oauth-button';

const Login: React.FC = ({}) => {
  return (
    <VStack
      gap={3}
      align='stretch'
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

      <Button as='a' href='/api/auth/signin' colorScheme='purple'>
        Sign in
      </Button>

      <HStack>
        <Divider />
        <Text as='span' fontSize='xs' whiteSpace='nowrap' fontWeight='thin'>
          or continue with
        </Text>
        <Divider />
      </HStack>

      <HStack gap={2}>
        {authOptions.providers.map((provider) => (
          <OauthButton
            key={provider.id}
            providerId={provider.id}
            providerName={provider.name}
            // variant='outline'
            size='lg'
            colorScheme='purple'
            flex={1}
            paddingX={4}
          />
        ))}
      </HStack>
    </VStack>
  );
};

export default Login;
