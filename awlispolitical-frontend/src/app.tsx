import { useState, useEffect } from 'preact/hooks';

import './app.css';

interface Party {
  name: string;
  votes: number;
  color: string;
};

export const App = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyColor, setNewPartyColor] = useState('');
  
  // Fetch parties from the server on mount
  useEffect(() => {
    fetch('http://localhost:3000/parties')
      .then(res => res.json())
      .then(data => setParties(data.parties));
  }, []);

  const createParty = async (e: Event) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/create-party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPartyName, color: newPartyColor })
    });
    const data = await res.json();
    setParties([...parties, data.party]);
    setNewPartyName('');
    setNewPartyColor('');
  };

  return (
    <div>
      <h1>Political Simulator</h1>
      <form onSubmit={createParty}>
        <label>
          Party Name:
          <input type="text" value={newPartyName} onInput={e => setNewPartyName(e.currentTarget.value)} />
        </label>
        <label>
          Party Color(hex):
          <input type="text" value={newPartyColor} onInput={e => setNewPartyColor(e.currentTarget.value)} />
        </label>
        <button type="submit">Create Party</button>
      </form>
      <hr />
      <ul>
        {parties.map(party => (
          <li style={{ color: party.color }}>
            {party.name} - {party.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};