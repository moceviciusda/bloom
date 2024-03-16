'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import {
  ChakraProvider,
  //  ColorModeScript
} from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';

import theme from '~/theme/theme';
import { useState } from 'react';

import { type AppRouter } from '~/server/api/root';
import { getUrl, transformer } from './shared';
import { SessionProvider } from 'next-auth/react';

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export const TRPCReactProvider = (props: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <SessionProvider>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
              {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
              {props.children}
            </ChakraProvider>
          </CacheProvider>
        </SessionProvider>
      </api.Provider>
    </QueryClientProvider>
  );
};
