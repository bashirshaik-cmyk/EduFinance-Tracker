import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const OTP_TIMER_SECONDS = 60;

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
        let interval: ReturnType<typeof setTimeout>;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setIsLoading(true);
        // Mock API call to send OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            setTimer(OTP_TIMER_SECONDS);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }, 1000);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }
        setIsLoading(true);
        // Mock OTP verification
        setTimeout(() => {
            if (enteredOtp === '123456') { // Mock success OTP
                onLoginSuccess();
            } else {
                setError('Invalid OTP. Please try again.');
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleResendOtp = () => {
        setTimer(OTP_TIMER_SECONDS);
        setOtp(new Array(6).fill(""));
        // Mock API call to resend
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (isNaN(Number(value))) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/50 dark:bg-background p-4">
            <Card className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {step === 'phone' ? (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleSendOtp}>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">Learner Login</CardTitle>
                                    <CardDescription>Enter your phone number to receive an OTP.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter your 10-digit number"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                            disabled={isLoading}
                                            maxLength={10}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleVerifyOtp}>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">Verify OTP</CardTitle>
                                    <CardDescription>An OTP has been sent to {phoneNumber}.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <div className="flex justify-center gap-2 mb-4">
                                        {otp.map((data, index) => (
                                            <Input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={data}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                disabled={isLoading}
                                                className="w-12 h-14 text-center text-xl font-semibold"
                                            />
                                        ))}
                                    </div>
                                    {error && <p className="text-sm text-destructive mb-2">{error}</p>}
                                    <div className="text-sm text-muted-foreground">
                                        {timer > 0 ? (
                                            <p>Resend OTP in {timer}s</p>
                                        ) : (
                                            <Button variant="link" type="button" onClick={handleResendOtp}>
                                                Resend OTP
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-4">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Verify & Proceed'}
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => { setStep('phone'); setError(''); }}>
                                        Back
                                    </Button>
                                </CardFooter>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default Login;