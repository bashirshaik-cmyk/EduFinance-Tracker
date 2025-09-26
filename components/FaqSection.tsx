import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';
import { FAQ_DATA } from '../constants';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const FaqSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* FIX: Use idiomatic JSX for Accordion components to fix type errors. */}
        <Accordion>
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FaqSection;
