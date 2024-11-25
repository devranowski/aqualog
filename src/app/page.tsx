'use client';

import Image from 'next/image';
import { Nunito } from 'next/font/google';
import LoginButton from '@/components/Auth/LoginButton';

const nunito = Nunito({ subsets: ['latin'] });

export default function LoginPage() {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-400 via-blue-300 to-blue-100 ${nunito.className}`}
    >
      <div className="m-4 w-full max-w-md space-y-8 rounded-xl bg-white bg-opacity-70 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Image src="/data-droplet-icon.svg" alt="Aqualog logo" width={80} height={80} priority />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Aqualog</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your aquarium with ease</p>
        </div>
        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
