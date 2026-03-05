import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [operatorId, setOperatorId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'credentials') {
      setStep('2fa');
    } else {
      setLoading(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 grid-tactical opacity-40" />
      <div className="absolute inset-0 scanline" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(105_30%_10%/0.4),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-sm border-2 border-primary bg-card mb-4 glow-green"
          >
            <Shield className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold tracking-[0.3em] text-primary text-glow-green">
            SYNDICATE
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-2 tracking-widest uppercase">
            AI Defence Drone Command Center
          </p>
        </div>

        {/* Login Card */}
        <div className="military-panel p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {step === 'credentials' ? 'Operator Authentication' : 'Hardware Token Verification'}
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {step === 'credentials' ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Operator ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={operatorId}
                      onChange={e => setOperatorId(e.target.value)}
                      placeholder="Enter Operator ID"
                      className="pl-10 bg-background border-border font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">PKI Passphrase</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPass ? 'text' : 'password'}
                      value={passphrase}
                      onChange={e => setPassphrase(e.target.value)}
                      placeholder="Enter PKI Passphrase"
                      className="pl-10 pr-10 bg-background border-border font-mono text-sm"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPass ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Fingerprint className="w-16 h-16 text-primary" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Hardware Token Code</label>
                  <Input
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Enter 6-digit token"
                    maxLength={6}
                    className="bg-background border-border font-mono text-sm text-center tracking-[0.5em] text-lg"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-display uppercase tracking-wider hover:brightness-110 glow-green"
            >
              {loading ? (
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  AUTHENTICATING...
                </motion.span>
              ) : step === 'credentials' ? 'PROCEED TO 2FA' : 'AUTHENTICATE'}
            </Button>

            {step === '2fa' && (
              <button type="button" onClick={() => setStep('credentials')} className="w-full text-xs text-muted-foreground font-mono hover:text-primary transition-colors">
                ← Back to credentials
              </button>
            )}
          </form>
        </div>

        {/* Classification Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-sm bg-accent/5">
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
              TS//SCI — Qatar Ministry of Defense — Authorized Personnel Only
            </span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-3 opacity-50">
            SYNDICATE C2 Platform v4.2.1 — All sessions monitored and logged
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
