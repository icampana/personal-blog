import { allPages } from 'contentlayer/generated';
import meta from 'metadata.json';
import Link from "next/link";
import { useState, MouseEvent } from 'react';

interface HeaderProps {
    children?: any,
    topLevel?: boolean
}

const Header = (props: HeaderProps) => {
    const { site } = meta;
    const { children, topLevel = false } = props;
    const [menuVisible, setMenuVisible] = useState(false);

    const formatLink = (url: string, title: string) => {
        return (<Link href={url}>
            <span className='font-bold text-black inline-block px-2 py-1 leading-8 uppercase hover:underline'>{title}</span>
        </Link>);
    }

    const menuLinks = allPages.map((item, index) => item && <li key={index} className="float-none lg:float-left">{formatLink(item.url, item.title)}</li>);

    const toggleMenu = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setMenuVisible(!menuVisible);
    }

    const SearchComponent = (
        <form action='/search' method='GET'>
            <label htmlFor='q' className='px-4 inline-block font-bold'>Buscar:</label>
            <input name='q' type='text' defaultValue='' className='border-2 rounded border-gray-400' />
        </form>
    );

    const TitleComponent = (topLevel) ?
        <h1 className='font-sans font-bold text-5xl'>
            <Link href={"/"}>{site.title}</Link>
        </h1>
    :
        <strong className='font-sans font-bold text-3xl mb-6' aria-hidden>
            <Link href={"/"}>{ site.title }</Link>
        </strong>
    ;

    return (<header className='px-1'>
        <div className="grid sm:grid-cols-1 sm:min-w-fit lg:grid-cols-3 my-1">
            {TitleComponent}

            <div className='justify-center my-4 text-sm text-center hidden lg:flex'>
                {SearchComponent}
            </div>

            <div>
                <div className='hidden lg:block float-right'>
                    <ul className='list-none'>{menuLinks}</ul>
                </div>
                <div className="flex justify-end lg:hidden">
                    <div className="space-y-2 fixed right-2 top-0 bg-white z-50 p-2" onClick={toggleMenu} role={'button'} tabIndex={0} aria-hidden="true">
                        <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                        <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                        <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                    </div>

                    <div className={`${ (!menuVisible) ? 'hidden' : ''} space-x-8 justify-end lg:flex fixed bg-white shadow-sm top-2 right-3 left-1 px-3 py-0 shadow-black my-7 z-50`}>
                        <ul className='list-none px-0 mx-0'>
                            {menuLinks}
                            <li>
                                <div className='my-5 border-b-4' />
                                {formatLink('/posts/page/1', 'Ver todos los artículos')}
                                <div className='my-5' />
                            </li>
                            <li>
                                <div className='my-5 border-b-4' />
                                {SearchComponent}
                                <div className='my-5' />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>


        {children}
    </header>);
}

export default Header;
