import React from 'react';
import Header from '~/components/header';
import CustomerList from '~/components/marketer/customer';

const CustomerPage = () => {
    return (
        <div>
            <Header title="Customer List" />
            <CustomerList />
        </div>
    );
};

export default CustomerPage;
