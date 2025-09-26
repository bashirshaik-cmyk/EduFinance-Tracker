
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { STAGE_DETAILS, STAGE_ORDER } from '../constants';
import { LoanStage, StageStatus, type StageHistoryItem } from '../types';
import { Badge } from './ui/Badge';

interface LoanTimelineProps {
  stageHistory: StageHistoryItem[];
  currentStage: LoanStage;
  rejectionReason?: string;
}

const getStatusBadgeVariant = (status: StageStatus) => {
  switch (status) {
    case StageStatus.Completed:
      return 'success';
    case StageStatus.InProgress:
      return 'warning';
    case StageStatus.Stuck:
    case StageStatus.Rejected:
        return 'stuck';
    default:
      return 'secondary';
  }
};

const LoanTimeline: React.FC<LoanTimelineProps> = ({ stageHistory, currentStage, rejectionReason }) => {
  const isRejected = currentStage === LoanStage.Rejected;

  let stagesToDisplay = [...STAGE_ORDER];
  if (isRejected) {
    const rejectionHistoryItem = stageHistory.find(s => s.stage === LoanStage.Rejected);
    const lastStageBeforeRejectionIndexInHistory = stageHistory.indexOf(rejectionHistoryItem!) - 1;
    
    if (lastStageBeforeRejectionIndexInHistory >= 0) {
        const lastStageBeforeRejection = stageHistory[lastStageBeforeRejectionIndexInHistory].stage;
        const lastStageIndexInOrder = STAGE_ORDER.indexOf(lastStageBeforeRejection);
        stagesToDisplay = STAGE_ORDER.slice(0, lastStageIndexInOrder + 1);
    } else {
        stagesToDisplay = [LoanStage.Application];
    }
    stagesToDisplay.push(LoanStage.Rejected);
  }

  const currentStageIndex = stagesToDisplay.indexOf(currentStage);

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
      {stagesToDisplay.map((stage, index) => {
        const historyItem = stageHistory.find(item => item.stage === stage);
        const status = historyItem ? historyItem.status : StageStatus.Pending;
        const isCompleted = index < currentStageIndex;
        const isActive = index === currentStageIndex;

        return (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start"
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 z-10",
                isCompleted ? 'bg-green-500 text-white' : 'bg-secondary',
                isActive && isRejected ? 'bg-red-500 text-white ring-4 ring-red-500/30' : '',
                isActive && !isRejected ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' : ''
              )}
            >
              {STAGE_DETAILS[stage].icon}
            </div>
            <div className="flex-grow pt-1">
              <h4 className={cn(
                "font-semibold text-lg",
                isActive ? "text-primary dark:text-white" : "text-muted-foreground"
              )}>
                {stage}
              </h4>
               {stage === LoanStage.Rejected && rejectionReason && (
                 <p className="text-sm text-red-600 dark:text-red-500 mt-1">{rejectionReason}</p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                {historyItem && <Badge variant={getStatusBadgeVariant(historyItem.status)}>{historyItem.status}</Badge>}
                {historyItem && <time className="text-sm text-muted-foreground">{historyItem.date}</time>}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LoanTimeline;