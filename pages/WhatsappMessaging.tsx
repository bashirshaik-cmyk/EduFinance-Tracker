
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateWhatsappMessage } from '../services/geminiService';
import type { LoanApplication } from '../types';
import { LoanStage } from '../types';
import { cn } from '../lib/utils';

const MOCK_APPLICATIONS: LoanApplication[] = [
    { applicationId: "APP123", learnerId: "LNR001", learnerName: "Rohan Verma", nbfcName: "FinanceNow", currentStage: LoanStage.VKYC, lastUpdated: "2024-07-28", stageHistory: [], daysInCurrentStage: 3 },
    { applicationId: "APP124", learnerId: "LNR002", learnerName: "Priya Singh", nbfcName: "EduLoan", currentStage: LoanStage.Approved, lastUpdated: "2024-07-29", stageHistory: [], daysInCurrentStage: 1 },
    { applicationId: "APP125", learnerId: "LNR003", learnerName: "Amit Patel", nbfcName: "FinanceNow", currentStage: LoanStage.ENACH, lastUpdated: "2024-07-22", stageHistory: [], daysInCurrentStage: 8 },
    { applicationId: "APP127", learnerId: "LNR005", learnerName: "Vikram Rathod", nbfcName: "EduLoan", currentStage: LoanStage.Bonafide, lastUpdated: "2024-07-20", stageHistory: [], daysInCurrentStage: 10 },
];

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
);

const WhatsappMessaging: React.FC = () => {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [selectedAppId, setSelectedAppId] = useState<string>('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Filter out disbursed applications for messaging
        setApplications(MOCK_APPLICATIONS.filter(app => app.currentStage !== LoanStage.Disbursed));
    }, []);

    const selectedApplication = useMemo(() => {
        return applications.find(app => app.applicationId === selectedAppId) || null;
    }, [applications, selectedAppId]);

    const handleGenerateMessage = useCallback(async () => {
        if (!selectedApplication) return;

        setIsLoading(true);
        setMessage('');
        setSendStatus('idle');
        try {
            const result = await generateWhatsappMessage(selectedApplication);
            setMessage(result);
        } catch (err) {
            setMessage('Failed to generate message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedApplication]);

    useEffect(() => {
        if (selectedAppId) {
            handleGenerateMessage();
        } else {
            setMessage('');
        }
    }, [selectedAppId, handleGenerateMessage]);

    const handleSendMessage = () => {
        setIsSending(true);
        // Simulate API call to send message
        setTimeout(() => {
            setIsSending(false);
            setSendStatus('success');
            setTimeout(() => setSendStatus('idle'), 3000); // Reset after 3 seconds
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-secondary/50 dark:bg-background p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <motion.div
                className="w-full max-w-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquareIcon /> AI-Powered WhatsApp Messaging
                        </CardTitle>
                        <CardDescription>
                            Select a learner to generate a personalized message and send updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="learner-select" className="text-sm font-medium">Select Learner</label>
                            <select
                                id="learner-select"
                                value={selectedAppId}
                                onChange={e => setSelectedAppId(e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">-- Select an application --</option>
                                {applications.map(app => (
                                    <option key={app.applicationId} value={app.applicationId}>
                                        {app.learnerName} ({app.applicationId}) - Stage: {app.currentStage}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedApplication && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Card className="bg-secondary/50 p-4">
                                    <h4 className="font-semibold">{selectedApplication.learnerName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Current Stage: <span className="font-medium text-primary">{selectedApplication.currentStage}</span> for {selectedApplication.daysInCurrentStage} days.
                                    </p>
                                </Card>
                            </motion.div>
                        )}
                        
                        <div className="space-y-2">
                            <label htmlFor="message-area" className="text-sm font-medium">Message Preview</label>
                             <div className="relative min-h-[200px] w-full rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <textarea
                                        id="message-area"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        className="h-full w-full bg-transparent resize-none focus:outline-none"
                                        rows={8}
                                        placeholder="AI will generate a message here..."
                                    />
                                )}
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Link to="/pre-dashboard">
                            <Button variant="ghost">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleGenerateMessage} disabled={!selectedAppId || isLoading}>
                                {isLoading ? 'Generating...' : 'Regenerate'}
                            </Button>
                             <Button onClick={handleSendMessage} disabled={!message || isSending || isLoading}>
                                <div className={cn("flex items-center", { 'w-28 justify-center': sendStatus !== 'idle' })}>
                                    {isSending && <><LoadingSpinnerSmall /> Sending...</>}
                                    {sendStatus === 'idle' && !isSending && <>Send Message</>}
                                    {sendStatus === 'success' && <><CheckCircleIcon className="mr-2 h-4 w-4" /> Sent!</>}
                                </div>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

// Icons
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const LoadingSpinnerSmall = () => <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default WhatsappMessaging;
