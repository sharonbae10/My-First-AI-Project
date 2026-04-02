import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <LoginForm
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}
        />
      </div>
    </main>
  );
}

