import { ReactNode } from "react";
import Head from "next/head";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>LAMP</title>
            </Head>
            <main className="h-screen w-screen grid place-items-center">{children}</main>
        </>
    );
};

export default Layout;
