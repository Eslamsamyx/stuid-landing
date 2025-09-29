import React from 'react';

const motion = {
  div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <div ref={ref} {...restProps}>{children}</div>;
  }),
  button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <button ref={ref} {...restProps}>{children}</button>;
  }),
  h1: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <h1 ref={ref} {...restProps}>{children}</h1>;
  }),
  h2: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <h2 ref={ref} {...restProps}>{children}</h2>;
  }),
  p: React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <p ref={ref} {...restProps}>{children}</p>;
  }),
  span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <span ref={ref} {...restProps}>{children}</span>;
  }),
  section: React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <section ref={ref} {...restProps}>{children}</section>;
  }),
  form: React.forwardRef<HTMLFormElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <form ref={ref} {...restProps}>{children}</form>;
  }),
  a: React.forwardRef<HTMLAnchorElement, any>(({ children, ...props }, ref) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap,
      whileInView, viewport, variants, ...restProps
    } = props;
    return <a ref={ref} {...restProps}>{children}</a>;
  }),
};

// Set display names for debugging
Object.keys(motion).forEach(key => {
  (motion as any)[key].displayName = `motion.${key}`;
});

export { motion };
export const AnimatePresence = ({ children }: any) => <>{children}</>;
export const useScroll = () => ({ scrollYProgress: { get: () => 0 } });
export const useTransform = () => 0;
export const useInView = () => true;
export const useAnimation = () => ({
  start: jest.fn(),
  set: jest.fn(),
  stop: jest.fn(),
  mount: jest.fn(),
});