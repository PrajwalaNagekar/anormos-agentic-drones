import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface Props {
  active: boolean;
  onComplete: () => void;
}

const ExportProgress = ({ active, onComplete }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) { setProgress(0); return; }
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); onComplete(); return 100; }
        return prev + 1;
      });
    }, 100); // 10 seconds total
    return () => clearInterval(interval);
  }, [active, onComplete]);

  if (!active && progress === 0) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="military-panel p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-primary uppercase animate-pulse-glow">
          Preparing secure export…
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-[9px] font-mono text-muted-foreground">
        {progress < 30 ? 'Encrypting payload…' : progress < 60 ? 'Generating audit signature…' : progress < 90 ? 'Packaging export bundle…' : 'Finalizing download…'}
      </p>
    </motion.div>
  );
};

export default ExportProgress;