import { Grand_Hotel, Inter } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Bloom',
  description: 'A team evaluation and growth monitoring platform.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
