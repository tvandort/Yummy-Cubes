import { ReactNode } from 'react';

export default function Button({ children }: { children: ReactNode }) {
  return <button className="border bg-blue-600">{children}</button>;
}
