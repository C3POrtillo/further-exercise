import { GoogleTagManager } from '@next/third-parties/google';
import React, { useState } from 'react';

import type { FC } from 'react';

import Container from '@/components/container/Container';
import Form from '@/components/form/Form';
import Header from '@/components/header/Header';

const Index: FC = () => {
  const [response, setResponse] = useState('No Data Received');

  return (
    <>
      {process.env.GTM && <GoogleTagManager gtmId={process.env.GTM} />}
      <Header heading="Integration Specialist Submission" />
      <Container>
        <Form id="task-one-form" setResponse={setResponse} />
      </Container>
      <Container>
        <div className="flex w-1/2 flex-col justify-center">
          <h2 className="w-full text-center text-3xl">Response</h2>
          <p className="self-center">{response}</p>
        </div>
      </Container>
    </>
  );
};

export default Index;
