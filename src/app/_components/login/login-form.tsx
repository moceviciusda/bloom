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
  Flex,
} from '@chakra-ui/react';
import { authOptions } from '~/server/auth';
import OauthButton from './oauth-button';

const Login: React.FC = ({}) => {
  return (
    <Flex flex={1} justify='center'>
      <VStack
        gap={3}
        align='stretch'
        fontSize='sm'
        justify='center'
        w='24rem'
        p={8}
      >
        <Heading>Sign In</Heading>
        <Text fontSize='smaller'>
          New to Bloom? <Link href='#'>Sign up for an account</Link>
        </Text>
        <FormControl isRequired>
          <Input id='email' type='email' placeholder='Enter your email' />
        </FormControl>
        <Tooltip label='Coming soon! Use social login for now' variant='bloom'>
          <Button
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
                colorScheme='purple'
                flex={1}
                paddingX={4}
              />
            );
          })}
        </HStack>
        <Text fontSize='smaller' textAlign='center'>
          By signing in, you agree to our <Link href='#'>Terms of Service</Link>{' '}
          and <Link href='#'>Privacy Policy</Link>.
        </Text>
      </VStack>
    </Flex>
  );
};

export default Login;
