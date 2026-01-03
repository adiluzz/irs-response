import { AuthGuard } from '@/components/auth/AuthGuard';

export default function Page() {
  return (
    <AuthGuard>
      <main style={{ padding: 24 }}>
        <h1>TAC Response</h1>
        <p>Scaffold build OK.</p>
      </main>
    </AuthGuard>
  );
}
