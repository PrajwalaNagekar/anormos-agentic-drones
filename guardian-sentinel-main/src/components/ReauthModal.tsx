import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// SIMULATION ONLY — This is a simulated biometric + TOTP re-authentication flow for prototype demonstration

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionLabel: string;
}

const ReauthModal = ({ open, onClose, onSuccess, actionLabel }: Props) => {
  const [step, setStep] = useState<'biometric' | 'totp'>('biometric');
  const [totp, setTotp] = useState('');
  const [bioDone, setBioDone] = useState(false);

  const handleBiometric = () => {
    setBioDone(true);
    setTimeout(() => setStep('totp'), 800);
  };

  const handleTotp = () => {
    if (totp.length >= 4) {
      onSuccess();
      setStep('biometric');
      setBioDone(false);
      setTotp('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-display uppercase text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" /> Re-Authentication Required
          </DialogTitle>
          <DialogDescription className="text-[10px] font-mono text-muted-foreground">
            {actionLabel} requires two-factor re-authentication.
            <br /><span className="text-accent">⚠ SIMULATION ONLY — NOT REAL BIOMETRIC</span>
          </DialogDescription>
        </DialogHeader>

        {step === 'biometric' ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <motion.div
              animate={bioDone ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
              transition={{ repeat: bioDone ? 0 : Infinity, duration: 2 }}
            >
              <Fingerprint className={`w-16 h-16 ${bioDone ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <p className="text-[10px] font-mono text-muted-foreground">
              {bioDone ? '✓ Biometric verified' : 'Tap to simulate biometric scan'}
            </p>
            {!bioDone && (
              <Button onClick={handleBiometric} size="sm" className="font-mono text-xs uppercase bg-primary text-primary-foreground">
                Simulate Biometric
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-[10px] font-mono text-primary mb-2">✓ Biometric verified</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase">TOTP Code</label>
              <Input
                value={totp}
                onChange={e => setTotp(e.target.value)}
                placeholder="Enter code"
                maxLength={6}
                className="font-mono text-center tracking-[0.5em] text-lg bg-background border-border"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="sm" className="font-mono text-[10px]">Cancel</Button>
          {step === 'totp' && (
            <Button onClick={handleTotp} size="sm" disabled={totp.length < 4} className="font-mono text-[10px] uppercase bg-primary text-primary-foreground">
              Verify & Proceed
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReauthModal;