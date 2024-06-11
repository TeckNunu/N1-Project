import React from 'react';
import Header from '~/components/header';

type Props = {
    children: React.ReactNode;
};

export const DefaultLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="min-w-[1200px]">
            <Header />
            <div>{children}</div>
        </div>
    );
};
