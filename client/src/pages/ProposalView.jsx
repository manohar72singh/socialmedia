import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSignature, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProposalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState('');

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProposal(data);
      } else {
        toast.error('Proposal not found');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (e) => {
    e.preventDefault();
    if (!signature) {
      toast.error('Please type your name to sign');
      return;
    }

    setIsSigning(true);
    try {
      const res = await fetch(`/api/proposals/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature_data: signature })
      });
      
      if (res.ok) {
        toast.success('Proposal Signed Successfully!');
        fetchProposal();
      } else {
        toast.error('Failed to sign proposal');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">Loading document...</div>;
  if (!proposal) return null;

  return (
    <div className="min-h-screen bg-[#050B14] font-['Inter'] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-32 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-50 p-8 md:p-12 border-b border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">Official Proposal</span>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900">{proposal.title}</h1>
                  <p className="text-slate-500 mt-2">Prepared for: <span className="font-bold text-slate-700">{proposal.client_name}</span></p>
                </div>
                <div className="text-right bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-sm text-slate-500 font-medium">Investment</p>
                  <p className="text-3xl font-black text-emerald-600">${proposal.price}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                {proposal.content}
              </div>
            </div>

            {/* Signature Block */}
            <div className="bg-slate-50 p-8 md:p-12 border-t border-slate-200">
              {proposal.status === 'signed' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">Proposal Accepted</h3>
                  <p className="text-emerald-600 mb-6">Digitally signed by {proposal.signature_data}</p>
                  <p className="text-sm text-slate-500 mb-6">An invoice has been automatically generated in your client dashboard.</p>
                  <button onClick={() => navigate('/client')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                    Go to Client Dashboard
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FileSignature className="text-indigo-600" /> Digital Signature Required
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-600 mb-6 text-sm">
                      By typing your name below and clicking "Accept & Sign", you agree to the terms and conditions outlined in this proposal. This acts as a legally binding digital signature.
                    </p>
                    <form onSubmit={handleSign} className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Type your full name..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSigning}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSigning ? 'Signing...' : <><ShieldCheck size={20} /> Accept & Sign</>}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
