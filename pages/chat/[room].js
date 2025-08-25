import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ChatRoom() {
  const router = useRouter();
  const { room } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input) return;
    setMessages(prev => [...prev, { sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Live Chat - {room}</h2>
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-4 h-[500px] overflow-y-auto mb-4">
        {messages.length === 0 && <p className="text-gray-500">Belum ada pesan. Sapa penjual untuk menagih.</p>}
        {messages.map((m, i) => (
          <p key={i} className="mb-2"><b>{m.sender}:</b> {m.text}</p>
        ))}
      </div>
      <div className="flex w-full max-w-lg">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-grow border px-3 py-2 rounded-l-md" placeholder="Tulis pesan..." />
        <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2 rounded-r-md">Kirim</button>
      </div>
    </div>
  );
}
