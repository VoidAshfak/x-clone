import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import QueryProvider from "@/providers/QueryProvider";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'X Clone',
    description: 'Next.js social media application',
}

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <QueryProvider>
                <html lang="en">
                    <body>
                        {children}
                    </body>
                </html>
            </QueryProvider>
        </ClerkProvider>
    );
}