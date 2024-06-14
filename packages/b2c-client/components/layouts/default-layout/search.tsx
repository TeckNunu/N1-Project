import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

const Search = () => {
    return (
        <div className="relative">
            <div className="flex rounded-full border border-slate-300 px-4 py-1.5 text-slate-500">
                <input
                    className="caret-primary z-10 h-[30px] w-[350px] border-none outline-none"
                    placeholder="Search..."
                    type="text"
                />
                <div className="flex w-[20px] items-center justify-center text-xl">
                    <SearchOutlined />
                </div>
            </div>
        </div>
    );
};

export default Search;
