import React from 'react';

import type { FC } from 'react';

interface HeaderProps {
  heading: string;
}

const Header: FC<HeaderProps> = ({ heading }) => (
  <div className="flex h-32 content-center justify-center bg-slate-900 text-center">
    <h1 className="content-center text-5xl font-semibold text-blue-400">{heading}</h1>
  </div>
);

export default Header;
