import React from 'react';
import { LoanStage, StageStatus } from "./types";
import type { ReactNode } from "react";

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const DocumentIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), React.createElement("polyline", { points: "14 2 14 8 20 8" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const CheckCircleIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const PenSquareIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), React.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const BanknoteIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }), React.createElement("circle", { cx: "12", cy: "12", r: "2" }), React.createElement("path", { d: "M6 12h.01M18 12h.01" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const VideoIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "m22 8-6 4 6 4V8Z" }), React.createElement("rect", { width: "14", height: "12", x: "2", y: "6", rx: "2", ry: "2" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const FileBadgeIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), React.createElement("path", { d: "M14 2v6h6" }), React.createElement("path", { d: "M8 13h1" }), React.createElement("path", { d: "M15 13h1" }), React.createElement("path", { d: "M11.5 13h1" }), React.createElement("path", { d: "M10 18l1.5-1.5 1.5 1.5" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const LandPlotIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }), React.createElement("path", { d: "M11 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" }));

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const XCircleIcon = () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("path", { d: "m15 9-6 6" }), React.createElement("path", { d: "m9 9 6 6" }));

export const STAGE_DETAILS: Record<LoanStage, { icon: ReactNode; description: string }> = {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    [LoanStage.Application]: { icon: React.createElement(DocumentIcon), description: "Your application has been submitted and is under review." },
    [LoanStage.Approved]: { icon: React.createElement(CheckCircleIcon), description: "Congratulations! Your loan has been approved by the NBFC." },
    [LoanStage.ESign]: { icon: React.createElement(PenSquareIcon), description: "Please complete the e-Sign process for the loan agreement." },
    [LoanStage.ENACH]: { icon: React.createElement(BanknoteIcon), description: "Set up your e-NACH mandate for automated repayments." },
    [LoanStage.VKYC]: { icon: React.createElement(VideoIcon), description: "Complete your Video Know Your Customer (VKYC) verification." },
    [LoanStage.Bonafide]: { icon: React.createElement(FileBadgeIcon), description: "We are verifying your bonafide certificate with the institution." },
    [LoanStage.Disbursed]: { icon: React.createElement(LandPlotIcon), description: "The loan amount has been disbursed to the institution. Your journey is complete!" },
    [LoanStage.Rejected]: { icon: React.createElement(XCircleIcon), description: "Your loan application could not be approved at this time." },
};

export const FAQ_DATA = [
    {
        question: "What is e-Sign?",
        answer: "e-Sign is an electronic signature that allows you to securely sign documents online. It's a legally valid and convenient way to finalize your loan agreement without physical paperwork.",
    },
    {
        question: "What is e-NACH?",
        answer: "e-NACH (Electronic National Automated Clearing House) is a digital payment service that allows you to authorize recurring payments, like your loan EMIs, directly from your bank account. It's safe, secure, and saves you the hassle of manual payments.",
    },
    {
        question: "How long does VKYC take?",
        answer: "The Video KYC (VKYC) process is usually very quick, often completed in 5-10 minutes. Please have your original PAN card and Aadhar card ready for the video call.",
    },
    {
        question: "When will the loan be disbursed?",
        answer: "Disbursal happens after all previous stages, including VKYC and Bonafide certificate verification, are successfully completed. You will be notified immediately once the amount is transferred.",
    },
];

export const STAGE_ORDER = [
    LoanStage.Application,
    LoanStage.Approved,
    LoanStage.ESign,
    LoanStage.ENACH,
    LoanStage.VKYC,
    LoanStage.Bonafide,
    LoanStage.Disbursed,
];