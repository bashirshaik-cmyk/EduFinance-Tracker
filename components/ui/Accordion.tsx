import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// FIX: Create a dedicated context for the accordion item value.
const AccordionItemContext = React.createContext<{ value: string }>({ value: '' });

const AccordionContext = React.createContext<{
  openItem: string | null;
  setOpenItem: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  openItem: null,
  setOpenItem: () => {},
});

// FIX: Changed inline prop types to named type aliases to improve type inference.
type AccordionProps = {
  children: React.ReactNode;
};

const Accordion = ({ children }: AccordionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className="w-full">{children}</div>
    </AccordionContext.Provider>
  );
};

// FIX: Changed inline prop types to named type aliases to improve type inference.
type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

// FIX: Wrap AccordionItem with the provider for its value context.
const AccordionItem = ({ value, children, className }: AccordionItemProps) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border-b border-border", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// FIX: Changed inline prop types to named type aliases to improve type inference.
type AccordionTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

// FIX: Consume contexts properly and simplify logic.
const AccordionTrigger = ({ children, className }: AccordionTriggerProps) => {
    const { openItem, setOpenItem } = React.useContext(AccordionContext);
    const { value } = React.useContext(AccordionItemContext);
    
    const isOpen = openItem === value;

    return (
        <button
            onClick={() => setOpenItem(isOpen ? null : value)}
            className={cn("flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)}
            aria-expanded={isOpen}
        >
            {children}
            <ChevronDownIcon
                className={cn("h-4 w-4 shrink-0 transition-transform duration-200", { "rotate-180": isOpen })}
            />
        </button>
    );
};

// FIX: Changed inline prop types to named type aliases to improve type inference.
type AccordionContentProps = {
  children: React.ReactNode;
  className?: string;
};

// FIX: Consume contexts properly to determine if content is open.
const AccordionContent = ({ children, className }: AccordionContentProps) => {
    const { openItem } = React.useContext(AccordionContext);
    const { value } = React.useContext(AccordionItemContext);
    const isOpen = openItem === value;

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className={cn("pb-4 pt-0", className)}>{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);

// FIX: Removed hacky and buggy implementation.
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };