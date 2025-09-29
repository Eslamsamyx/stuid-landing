import React from 'react';

// Create mock icon component factory
const createIcon = (name: string) => {
  const Icon = React.forwardRef<SVGSVGElement, any>((props, ref) => (
    <svg ref={ref} data-icon={name} {...props}>
      <text>{name}</text>
    </svg>
  ));
  Icon.displayName = name;
  return Icon;
};

// Export all the icons used in the app
export const ChevronRight = createIcon('ChevronRight');
export const ChevronLeft = createIcon('ChevronLeft');
export const ChevronDown = createIcon('ChevronDown');
export const CheckCircle = createIcon('CheckCircle');
export const Check = createIcon('Check');
export const X = createIcon('X');
export const XCircle = createIcon('XCircle');
export const Send = createIcon('Send');
export const Trophy = createIcon('Trophy');
export const Gift = createIcon('Gift');
export const Sparkles = createIcon('Sparkles');
export const Star = createIcon('Star');
export const Shield = createIcon('Shield');
export const Mail = createIcon('Mail');
export const Calendar = createIcon('Calendar');
export const Phone = createIcon('Phone');
export const Home = createIcon('Home');
export const MapPin = createIcon('MapPin');
export const Globe = createIcon('Globe');
export const User = createIcon('User');
export const Users = createIcon('Users');
export const Smartphone = createIcon('Smartphone');
export const ArrowRight = createIcon('ArrowRight');
export const ArrowLeft = createIcon('ArrowLeft');
export const AlertCircle = createIcon('AlertCircle');
export const Info = createIcon('Info');
export const Heart = createIcon('Heart');
export const Zap = createIcon('Zap');
export const BookOpen = createIcon('BookOpen');
export const Award = createIcon('Award');
export const Clock = createIcon('Clock');
export const DollarSign = createIcon('DollarSign');
export const Percent = createIcon('Percent');
export const ShoppingCart = createIcon('ShoppingCart');
export const TrendingUp = createIcon('TrendingUp');
export const Briefcase = createIcon('Briefcase');
export const GraduationCap = createIcon('GraduationCap');
export const Building = createIcon('Building');
export const CreditCard = createIcon('CreditCard');
export const Loader2 = createIcon('Loader2');
export const RefreshCw = createIcon('RefreshCw');
export const AlertTriangle = createIcon('AlertTriangle');