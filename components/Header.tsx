import meta from 'metadata.json';
import Link from "next/link";

interface HeaderProps {
    children?: any,
    topLevel?: boolean
}

const Header = (props: HeaderProps) => {
    const { site } = meta;
    const { children, topLevel = true } = props;

    if (topLevel) {
        return (<header className='px-1'>
            <h1 className='font-sans font-bold text-5xl'>
                <Link href={"/"}><a>{site.title}</a></Link>
            </h1>

            {children}
        </header>);
    }

    return (
        <div className='text-left' aria-hidden>
            <strong className='font-sans font-bold text-3xl mb-6'>
                <Link href={"/"}><a>{ site.title }</a></Link>
            </strong>

            {children}
        </div>
    );

}

export default Header;