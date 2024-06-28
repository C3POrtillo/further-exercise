import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import React from 'react';

import type { FC } from 'react';

import Container from '@/components/container/Container';
import Form from '@/components/form/Form';
import Header from '@/components/header/Header';

const Index: FC = () => (
  <>
    <GoogleTagManager gtmId="GTM-NDPHBTKT" />
    <GoogleAnalytics gaId="G-XQXWQB8SXL" />
    <Header heading="Integration Specialist Submission" />
    <Container>
      <Form id="task-one-form" />
    </Container>
  </>
);

export default Index;
