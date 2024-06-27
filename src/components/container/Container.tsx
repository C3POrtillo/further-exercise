import React from 'react';

import type { FC, PropsWithChildren } from 'react';

const Container: FC<PropsWithChildren> = ({ children }) => (
  <section className="flex content-center justify-center">{children}</section>
);

export default Container;
