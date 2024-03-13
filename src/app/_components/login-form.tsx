import React from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Text,
  Link,
} from '@chakra-ui/react';

interface LoginProps {
  // Add any props you need here, like onSubmit handler
}

const Login: React.FC<LoginProps> = ({}) => {
  return (
    <VStack
      spacing={4}
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
      <FormControl display='flex' alignItems='center'>
        <Checkbox id='remember-me' defaultChecked>
          Remember me
        </Checkbox>
      </FormControl>

      <Button as='a' href='/api/auth/signin' colorScheme='purple' w='100%'>
        Sign in
      </Button>

      <Text alignSelf='center'>- OR -</Text>

      <Button
        as='a'
        href='#'
        variant='outline'
        size='md'
        colorScheme='purple'
        w='100%'
      >
        Continue with Google
      </Button>
      <Button
        as='a'
        href='#'
        variant='outline'
        size='md'
        colorScheme='purple'
        w='100%'
      >
        Continue with GitHub
      </Button>
    </VStack>
  );
};

export default Login;
