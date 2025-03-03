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

const SearchComponent = () => {
  const [ toggleSearch, setToggleSearch ] = React.useState(false);
  const controlRef = React.useRef<HTMLInputElement>(null);

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setToggleSearch(!toggleSearch);
    if (controlRef.current) {
      controlRef.current.focus();
    }
  };

  return (<form action='/search' method='GET' className='leading-none inline-block'>
    <span className="inline-block mr-2">
      <button className={`btn btn-square btn-ghost ${toggleSearch ? 'hidden' : 'block'}`} onClick={handleToggle}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
      </button>
    </span>
    <div className="inline-block">
      <input
        ref={controlRef}
        name='q'
        type='text'
        defaultValue=''
        className={`input input-bordered w-full lg:w-32 text-neutral-900 ${toggleSearch ? 'block' : 'hidden'}`}
      />
    </div>
  </form>
);
}

const ThemeToggle = () => {
  const themeToggle = (event: React.ChangeEvent<HTMLInputElement>) => localStorage.setItem('theme', event.target.checked ? 'winter' : 'night');
  return (
    <label className="toggle text-base-content">
      <input type="checkbox" value="winter" className="theme-controller" onChange={themeToggle} />
      <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>
      <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>
    </label>
  )
}

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
              className='menu menu-md dropdown-content bg-neutral rounded-box z-1 mt-3 w-52 p-2 shadow'>
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
          <ThemeToggle />
        </div>
      </div>
      <div>
        {children}
      </div>
    </header>
  );
};

export default Header;
