export function Main({ children }) {
  return (
    <main className="flex flex-column item-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Notes</h1>
      {children}
    </main>
  );
}
