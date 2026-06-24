import React, { useState } from 'react';
import { CreditCard, Check, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'pro',
    name: 'Pro Tier',
    price: '$500/mo',
    features: ['Advanced Analytics', 'AI Content Generator', 'Priority Support'],
    color: 'from-blue-500 to-indigo-500',
    buttonColor: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$1500/mo',
    features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom 3D Assets', 'Unlimited AI Generations'],
    color: 'from-purple-500 to-pink-500',
    buttonColor: 'bg-pink-500 hover:bg-pink-600',
    popular: true
  }
];

export default function SubscriptionManager({ currentTier, clientId, email }) {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (planId) => {
    setLoading(planId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, clientId, email })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to initiate checkout');
      }
    } catch (err) {
      toast.error('Network error during checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="premium-glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Manage Subscription</h2>
      </div>

      <div className="mb-8">
        <p className="text-slate-400">Current Plan: <span className="text-white font-bold uppercase tracking-wider">{currentTier}</span></p>
        {currentTier === 'free' && (
          <p className="text-sm text-yellow-400 mt-2 flex items-center gap-1">
            <Zap className="w-4 h-4" /> Upgrade to unlock premium features
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative rounded-xl p-6 border ${plan.popular ? 'border-pink-500/50' : 'border-slate-700'} bg-slate-900/50`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r mb-6" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} className={`bg-gradient-to-r ${plan.color} text-transparent bg-clip-text text-3xl font-black mb-6`}>
              {plan.price}
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading === plan.id || currentTier === plan.id || (currentTier === 'enterprise' && plan.id === 'pro')}
              className={`w-full py-3 rounded-xl text-white font-bold flex justify-center items-center gap-2 transition-all ${
                currentTier === plan.id || (currentTier === 'enterprise' && plan.id === 'pro')
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : plan.buttonColor
              }`}
            >
              {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {currentTier === plan.id ? 'Current Plan' : (currentTier === 'enterprise' && plan.id === 'pro' ? 'Included' : 'Upgrade')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
