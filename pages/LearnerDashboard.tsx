import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import FaqSection from '../components/FaqSection';
import LoanTimeline from '../components/LoanTimeline';
import type { LoanApplication, Notification } from '../types';
import { LoanStage, StageStatus } from '../types';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_APPROVED_LEARNER_DATA: LoanApplication = {
  applicationId: "APP12345678",
  learnerId: "LNR98765",
  learnerName: "Aisha Sharma",
  nbfcName: "EduFinance Capital",
  currentStage: LoanStage.Disbursed,
  lastUpdated: "2024-08-05T12:00:00Z",
  daysInCurrentStage: 2,
  rejectionReason: undefined,
  stageHistory: [
    { stage: LoanStage.Application, status: StageStatus.Completed, date: "2024-07-20" },
    { stage: LoanStage.Approved, status: StageStatus.Completed, date: "2024-07-22" },
    { stage: LoanStage.ESign, status: StageStatus.Completed, date: "2024-07-24" },
    { stage: LoanStage.ENACH, status: StageStatus.Completed, date: "2024-07-25" },
    { stage: LoanStage.VKYC, status: StageStatus.Completed, date: "2024-07-28" },
    { stage: LoanStage.Bonafide, status: StageStatus.Completed, date: "2024-08-02" },
    { stage: LoanStage.Disbursed, status: StageStatus.Completed, date: "2024-08-05" },
  ],
};

const MOCK_REJECTED_LEARNER_DATA: LoanApplication = {
    applicationId: "APP87654321",
    learnerId: "LNR56789",
    learnerName: "Rohan Mehra",
    nbfcName: "EduFinance Capital",
    currentStage: LoanStage.Rejected,
    lastUpdated: "2024-07-25T14:30:00Z",
    daysInCurrentStage: 5,
    rejectionReason: "The provided income proof documents did not meet the minimum eligibility criteria required by the lender.",
    stageHistory: [
      { stage: LoanStage.Application, status: StageStatus.Completed, date: "2024-07-20" },
      { stage: LoanStage.Approved, status: StageStatus.Completed, date: "2024-07-22" },
      { stage: LoanStage.Rejected, status: StageStatus.Rejected, date: "2024-07-25" },
    ],
};

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: "1", title: "e-NACH Mandate Successful", description: "Your bank has approved the e-NACH mandate.", date: "2024-07-25", read: false },
    { id: "2", title: "Loan Agreement Signed", description: "You have successfully e-signed the loan agreement.", date: "2024-07-24", read: true },
    { id: "3", title: "Loan Approved!", description: "Congratulations! Your loan from EduFinance Capital has been approved.", date: "2024-07-22", read: true },
];

const Header: React.FC<{onLogout: () => void}> = ({onLogout}) => (
    <div className="text-center mb-12 relative">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-primary dark:text-white"
        >
            Your Loan Journey 🌱
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
        >
            Follow your application's progress from start to finish.
        </motion.p>
        <Button variant="outline" onClick={onLogout} className="absolute top-0 right-0">Logout</Button>
    </div>
);

const NotificationPanel: React.FC<{ notifications: Notification[] }> = ({ notifications }) => (
    <Card>
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {notifications.map(notif => (
                    <li key={notif.id} className="flex items-start space-x-3">
                        <div className={cn("mt-1.5 h-2 w-2 rounded-full", !notif.read ? "bg-blue-500" : "bg-gray-300")}></div>
                        <div>
                            <p className="font-semibold">{notif.title}</p>
                            <p className="text-sm text-muted-foreground">{notif.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

const RejectionInfoCard: React.FC<{ reason: string }> = ({ reason }) => (
    <Card className="border-red-500/50 bg-red-500/5 dark:bg-red-500/10">
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white">
                    <AlertTriangleIcon />
                </div>
                <div>
                    <CardTitle className="text-red-700 dark:text-red-400">Application Status: Rejected</CardTitle>
                    <CardDescription className="text-red-600 dark:text-red-400/80">
                        We're sorry, your loan could not be approved.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="font-semibold text-sm text-primary">Reason for rejection:</p>
            <p className="text-muted-foreground mt-1">{reason}</p>
        </CardContent>
        <CardFooter>
            <Button variant="outline">Contact Support</Button>
        </CardFooter>
    </Card>
);

const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const LearnerDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [application, setApplication] = useState<LoanApplication | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [profileType, setProfileType] = useState<'approved' | 'rejected'>('approved');

    useEffect(() => {
        if (profileType === 'approved') {
            setApplication(MOCK_APPROVED_LEARNER_DATA);
        } else {
            setApplication(MOCK_REJECTED_LEARNER_DATA);
        }
        setNotifications(MOCK_NOTIFICATIONS);
    }, [profileType]);

    if (!application) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-secondary/50 dark:bg-background p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Header onLogout={onLogout}/>
                <div className="flex justify-center gap-4 mb-8">
                    <Button variant={profileType === 'approved' ? 'default' : 'outline'} onClick={() => setProfileType('approved')}>
                        View Approved Case
                    </Button>
                    <Button variant={profileType === 'rejected' ? 'destructive' : 'outline'} onClick={() => setProfileType('rejected')}>
                        View Rejected Case
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                         {application.rejectionReason && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="mb-8"
                            >
                                <RejectionInfoCard reason={application.rejectionReason} />
                            </motion.div>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Progress Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LoanTimeline 
                                  stageHistory={application.stageHistory} 
                                  currentStage={application.currentStage}
                                  rejectionReason={application.rejectionReason}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                            <NotificationPanel notifications={notifications} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Loan Details</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                    <p><strong>Application ID:</strong> {application.applicationId}</p>
                                    <p><strong>Learner:</strong> {application.learnerName}</p>
                                    <p><strong>NBFC Partner:</strong> {application.nbfcName}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">Download Summary</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <FaqSection />
                </motion.div>
            </div>
        </div>
    );
};

export default LearnerDashboard;