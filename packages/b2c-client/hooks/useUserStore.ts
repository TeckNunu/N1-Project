import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import * as request from 'common/utils/http-request';
import { QueryResponseGetOneType } from 'common/types';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

type User = {
    name: string | null;
    email: string | null;
    image: string | null;
    address: string | null;
    gender: string | null;
    dob: string | null;
    phone: string | null;
};

type UserState = {
    data: QueryResponseGetOneType<User> | null | undefined;
    setData: (
        payload: QueryResponseGetOneType<User> | null | undefined
    ) => void;
};

const useUserStore = create<UserState>((set) => {
    return {
        data: null,
        setData: (payload) => set({ data: payload }),
    };
});

export const useUserQueryStore = () => {
    const auth = useAuth();
    const { data, setData } = useUserStore();

    const {
        data: userResponse,
        refetch,
        isFetching,
    } = useQuery<QueryResponseGetOneType<User>>({
        queryKey: ['user-info'],
        queryFn: () => request.get('user').then((res) => res.data),
        enabled: !!auth,
    });

    useEffect(() => {
        setData(userResponse);
    }, [userResponse]);

    return {
        user: data,
        reload: refetch,
        isFetching,
    };
};
