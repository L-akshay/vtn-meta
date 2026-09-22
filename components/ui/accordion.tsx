"use client";
// shadcn/ui Accordion (Radix primitive). Styles live in globals.css under .accordion-*.
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "../icons";
import type { ComponentProps } from "react";

const cn = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("accordion-item", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return <AccordionPrimitive.Header className="accordion-header">
    <AccordionPrimitive.Trigger className={cn("accordion-trigger", className)} {...props}>
      {children}
      <ChevronDown className="accordion-chevron" size={18} strokeWidth={2} aria-hidden="true" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>;
}

function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return <AccordionPrimitive.Content className="accordion-content" {...props}>
    <div className={cn("accordion-body", className)}>{children}</div>
  </AccordionPrimitive.Content>;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
