import { formatUsername } from '../util';
export function Header({ user, signOut }) {
  return (
    <header className="header-style">
      <h1>Welcome {formatUsername(user.username)}</h1>;
      <button onClick={() => signOut()}>Log out</button>
    </header>
  );
}
