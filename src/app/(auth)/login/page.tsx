'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Checkbox } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks';
import { DEMO_ACCOUNT } from '@/features/auth/service';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      remember: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data);
    if (result) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[720px] bg-[#FD6900] flex-col items-center justify-center p-8 relative overflow-hidden">
        <Image src="/login-side.svg" alt="Login illustration" width={500} height={400} className="w-full max-w-[500px]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[450px]">
          <div className="mb-8 text-center lg:text-left">
            <div className="w-[100px] h-[79px] bg-[#FD6900] rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-6 overflow-hidden">
              <Image src="/logo.svg" alt="Logo" width={100} height={79} className="rounded-lg" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-800 mb-2">Sign In</h1>
            <p className="text-neutral-500">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger-50 text-danger-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-600">
            <p className="font-medium text-neutral-700 mb-1">Demo credentials (pre-filled)</p>
            <p>Email: {DEMO_ACCOUNT.email}</p>
            <p>Password: {DEMO_ACCOUNT.password}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

              <Checkbox id="remember" label="Remember me" {...register('remember')} />

            <Button type="submit" size="lg" className="w-full bg-[#FD6900] hover:bg-[#e05d00]" loading={loading}>
              Login
            </Button>
          </form>




        </div>
      </div>
    </div>
  );
}
