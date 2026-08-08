import React, { useState, useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Users, Plus, AlertOctagon, Phone 
} from 'lucide-react';

export const SafeCircle: React.FC = () => {
  const { contacts, addContact, triggerSOS } = useWellness();

  // New Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('Family');
  const [submitting, setSubmitting] = useState(false);

  // SOS Countdown states
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await addContact({ name, phone, email, relation });
      setName('');
      setPhone('');
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerSOS = () => {
    // Initiate a 3-second safety countdown
    setSosCountdown(3);
  };

  useEffect(() => {
    let timer: any = null;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown(sosCountdown - 1);
      }, 1000);
    } else if (sosCountdown === 0) {
      // Countdown finished -> Trigger SOS!
      triggerSOS();
      setSosCountdown(null);
      alert("🚨 SOS Broadcast Alert Simulated! Contacts have been notified.");
    }
    return () => clearTimeout(timer);
  }, [sosCountdown]);

  const handleCancelSOS = () => {
    setSosCountdown(null);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* SOS Countdown Overlay popup */}
      {sosCountdown !== null && (
        <div className="fixed inset-0 z-55 bg-red-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
          <AlertOctagon className="text-white fill-red-600 animate-bounce mb-6" size={64} />
          <h2 className="text-3xl font-extrabold font-sans">Triggering SOS Alert</h2>
          <p className="text-sm text-red-200 mt-2 max-w-xs text-center">
            MindSync is broadcasting emergency notifications in:
          </p>
          <h1 className="text-8xl font-black my-8 animate-ping">{sosCountdown}</h1>
          <button 
            onClick={handleCancelSOS}
            className="px-8 py-3 bg-white text-red-600 font-bold rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel Broadcast
          </button>
        </div>
      )}

      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Safe Circle</h2>
        <p className="text-slate-500 text-sm mt-1">Configure trusted contacts. Share wellness reports, and trigger SOS alerts in crisis.</p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOS Trigger Card */}
        <section className="bg-red-50/50 backdrop-blur-md p-8 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <AlertOctagon size={28} />
          </div>
          <h3 className="text-lg font-bold text-red-800">SOS Panic Button</h3>
          <p className="text-xs text-red-600/70 mt-2 max-w-xs leading-relaxed">
            One-click triggers simulated email and SMS broadcasts with real-time location tags to your trusted circle.
          </p>

          <button 
            onClick={handleTriggerSOS}
            className="mt-8 px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all text-sm tracking-wide"
          >
            🚨 Trigger SOS Panic Alert
          </button>
        </section>

        {/* Contacts Directory */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
            <Users className="text-slate-700" size={18} />
            <span>Trusted Circle Contacts</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Family and friends notified during emergency panics</p>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
            {contacts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No contacts listed. Register one on the right!</p>
            ) : (
              contacts.map(c => (
                <div 
                  key={c.id}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3 text-left">
                    <div className="w-9 h-9 rounded-xl bg-slate-200/50 text-slate-500 flex items-center justify-center font-bold text-xs">
                      {c.name.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                        <span>{c.name}</span>
                        <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
                          {c.relation}
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                        <Phone size={10} className="mr-1" />
                        <span>{c.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add Contact Form */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Plus size={18} className="text-accent-sky" />
            <span>Register Safe Contact</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Name</label>
              <input 
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aarav Patil" required
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Phone</label>
              <input 
                type="text" value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210" required
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Relation</label>
              <select 
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Therapist">Therapist</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <button
              type="submit" disabled={submitting}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all"
            >
              <span>{submitting ? 'Registering...' : 'Register Circle Member'}</span>
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};
