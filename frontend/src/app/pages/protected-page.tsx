// pages/protected-page.tsx
import withAuth from '../hocs/withAuth';

interface User {
  name: string;
}

const ProtectedPage = ({ user }: { user: User }) => {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
};

export default withAuth(ProtectedPage);