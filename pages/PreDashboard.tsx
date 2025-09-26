
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import AiAssistantModal from '../components/AiAssistantModal';
import type { LoanApplication } from '../types';
import { LoanStage, StageStatus } from '../types';

// Mock Data
const MOCK_APPLICATIONS: LoanApplication[] = [
    { applicationId: "APP123", learnerId: "LNR001", learnerName: "Rohan Verma", nbfcName: "FinanceNow", currentStage: LoanStage.VKYC, lastUpdated: "2024-07-28", stageHistory: [], daysInCurrentStage: 3 },
    { applicationId: "APP124", learnerId: "LNR002", learnerName: "Priya Singh", nbfcName: "EduLoan", currentStage: LoanStage.Approved, lastUpdated: "2024-07-29", stageHistory: [], daysInCurrentStage: 1 },
    { applicationId: "APP125", learnerId: "LNR003", learnerName: "Amit Patel", nbfcName: "FinanceNow", currentStage: LoanStage.ENACH, lastUpdated: "2024-07-22", stageHistory: [], daysInCurrentStage: 8 },
    { applicationId: "APP126", learnerId: "LNR004", learnerName: "Sunita Gupta", nbfcName: "StudyFund", currentStage: LoanStage.Disbursed, lastUpdated: "2024-07-25", stageHistory: [], daysInCurrentStage: 5 },
    { applicationId: "APP127", learnerId: "LNR005", learnerName: "Vikram Rathod", nbfcName: "EduLoan", currentStage: LoanStage.Bonafide, lastUpdated: "2024-07-20", stageHistory: [], daysInCurrentStage: 10 },
    { applicationId: "APP128", learnerId: "LNR006", learnerName: "Neha Sharma", nbfcName: "FinanceNow", currentStage: LoanStage.ESign, lastUpdated: "2024-07-29", stageHistory: [], daysInCurrentStage: 1 },
];

const SummaryCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={color}>{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const PreDashboard: React.FC = () => {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'stuck' | LoanStage>('all');
    const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setApplications(MOCK_APPLICATIONS);
    }, []);

    const summaryStats = useMemo(() => {
        const total = applications.length;
        const approved = applications.filter(a => a.stageHistory.some(s => s.stage === LoanStage.Approved)).length;
        const disbursed = applications.filter(a => a.currentStage === LoanStage.Disbursed).length;
        const stuck = applications.filter(a => a.daysInCurrentStage > 2).length;
        return { total, approved, disbursed, stuck };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        return applications
            .filter(app => {
                if (filter === 'stuck') return app.daysInCurrentStage > 2;
                if (filter !== 'all') return app.currentStage === filter;
                return true;
            })
            .filter(app => 
                app.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [applications, searchTerm, filter]);
    
    const handleAiAssistantClick = (application: LoanApplication) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-secondary/50 dark:bg-background p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold">PRE Dashboard</h1>
                    <p className="text-muted-foreground">Monitor applications and resolve bottlenecks.</p>
                </motion.div>

                <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                >
                    <SummaryCard title="Total Applications" value={summaryStats.total} icon={<UsersIcon />} color="text-blue-500"/>
                    <SummaryCard title="Approved" value={summaryStats.approved} icon={<CheckCircleIcon />} color="text-green-500" />
                    <SummaryCard title="Disbursed" value={summaryStats.disbursed} icon={<DollarSignIcon />} color="text-indigo-500" />
                    <SummaryCard title="Stuck > 48hrs" value={summaryStats.stuck} icon={<AlertTriangleIcon />} color="text-red-500" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>All Applications</CardTitle>
                            <CardDescription>Search, filter, and manage all loan applications.</CardDescription>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Input 
                                    placeholder="Search by name or ID..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                                <select 
                                    value={filter} 
                                    onChange={e => setFilter(e.target.value as any)}
                                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="all">All Stages</option>
                                    <option value="stuck">Stuck Cases</option>
                                    {Object.values(LoanStage).map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                </select>
                                <div className="flex gap-2 ml-auto">
                                    <Link to="/pre-whatsapp">
                                        <Button variant="outline">Send WhatsApp</Button>
                                    </Link>
                                    <Button>Export CSV</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                                        <tr>
                                            <th className="px-6 py-3">Learner Name</th>
                                            <th className="px-6 py-3">Application ID</th>
                                            <th className="px-6 py-3">Current Stage</th>
                                            <th className="px-6 py-3">Days Stuck</th>
                                            <th className="px-6 py-3">Last Updated</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApplications.map(app => {
                                            const isStuck = app.daysInCurrentStage > 2;
                                            return (
                                                <tr key={app.applicationId} className="border-b dark:border-gray-700 hover:bg-accent">
                                                    <td className="px-6 py-4 font-medium">{app.learnerName}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{app.applicationId}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={isStuck ? 'stuck' : 'secondary'}>{app.currentStage}</Badge>
                                                    </td>
                                                    <td className={`px-6 py-4 font-bold ${isStuck ? 'text-red-500' : ''}`}>{app.daysInCurrentStage}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{app.lastUpdated}</td>
                                                    <td className="px-6 py-4">
                                                        {isStuck && 
                                                            <Button size="sm" variant="destructive" onClick={() => handleAiAssistantClick(app)}>
                                                                AI Help
                                                            </Button>
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <AiAssistantModal 
                application={selectedApplication}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

// Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default PreDashboard;
