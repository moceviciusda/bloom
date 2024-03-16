'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '~/trpc/react';

export function CreateOrganization() {
  const router = useRouter();
  const [name, setName] = useState('');

  const createOrganization = api.organization.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName('');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createOrganization.mutate({ name });
      }}
    >
      <input
        type='text'
        placeholder='Title'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type='submit' disabled={createOrganization.isLoading}>
        {createOrganization.isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
