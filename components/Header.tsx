import { allPages } from 'contentlayer/generated';
import meta from 'metadata.json';
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  children?: any;
}

const formatLink = (url: string, title: string) => {
  return <Link href={url}>{title}</Link>;
};

const MenuItem = (url: string, label: string, key: number) => {
  return <li key={key}>{formatLink(url, label)}</li>;
};

const SearchComponent = () => (
  <form action='/search' method='GET'>
    <label htmlFor='q' className='px-4 inline-block font-bold'>
      Buscar:
    </label>
    <input
      name='q'
      type='text'
      defaultValue=''
      className='input input-bordered w-24 md:w-auto text-neutral-900'
    />
  </form>
);

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { site } = meta;

  const menuLinks = [
    MenuItem('/', 'Home', 0),
    MenuItem('/portafolio', 'Portfolio', 1),
    ...allPages.map((item, index) => MenuItem(item.url, item.title, index + 2)),
  ];

  return (
    <header>
      <div className='navbar bg-neutral text-neutral-content'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost btn-circle'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                {' '}
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h7'
                />{' '}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-neutral rounded-box z-1 mt-3 w-52 p-2 shadow'>
              {menuLinks}
            </ul>
          </div>
        </div>
        <div className='navbar-center'>
          <Link className='btn btn-ghost text-xl' href={'/'}>
            {site.title}
          </Link>
        </div>
        <div className='navbar-end'>
          <SearchComponent />
        </div>
      </div>
      <div>
        {children}
      </div>
    </header>
  );
};

export default Header;
