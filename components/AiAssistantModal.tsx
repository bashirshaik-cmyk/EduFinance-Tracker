
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { getStuckCaseSuggestion } from '../services/geminiService';
import type { LoanApplication } from '../types';

interface AiAssistantModalProps {
  application: LoanApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ application, isOpen, onClose }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchSuggestion = useCallback(async () => {
    if (!application) return;

    setIsLoading(true);
    setError('');
    setSuggestion('');
    try {
      const result = await getStuckCaseSuggestion(application);
      setSuggestion(result);
    } catch (err) {
      setError('Failed to get suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [application]);
  
  useEffect(() => {
    if (isOpen && application) {
      fetchSuggestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, application]);

  const formatSuggestion = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>;
        }
        if (line.toLowerCase().includes('probable reasons') || line.toLowerCase().includes('actionable next steps')) {
          return <h4 key={index} className="font-semibold mt-4 mb-2 text-primary">{line}</h4>;
        }
        return <p key={index}>{line}</p>;
      });
  };

  return (
    <AnimatePresence>
      {isOpen && application && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant for Stuck Case</CardTitle>
                <CardDescription>
                  Analyzing {application.learnerName}'s application (ID: {application.applicationId})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-destructive text-center">{error}</p>}
                {suggestion && (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-2">
                     {formatSuggestion(suggestion)}
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-2">
                   <Button variant="outline" onClick={onClose}>Close</Button>
                   <Button onClick={fetchSuggestion} disabled={isLoading}>
                    {isLoading ? 'Regenerating...' : 'Regenerate Suggestion'}
                   </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiAssistantModal;
