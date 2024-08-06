import { useState } from 'react';
import { useRouter } from 'next/router';

type UserFormProps = {
  onStart: (name: string, email: string) => void;
};

export default function UserForm({ onStart }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(name, email);
  };

  return (
    <div className='text-center my-auto'>
    <form className="mt-28 mx-auto max-w-md" onSubmit={handleSubmit}>
      <h2 className="font-bold text-white text-3xl glow-animation">Enter Your Details</h2>
      <div className="mt-5">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-md"
          required
          autoComplete='John Doe'
        />
      </div>
      <div className="mt-3">
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-md"
          required
          autoComplete='johndoe@gmail.com'
        />
      </div>
      <button 
  type="submit" 
  className="mt-5 p-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md transition-transform transform hover:scale-110 hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
>
  Start Game
</button>

    </form>
    </div>
  );
}
