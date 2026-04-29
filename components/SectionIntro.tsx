import React, { ReactNode } from 'react';

interface SectionIntroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = ''
}) => {
  return (
    <div className={className}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className={`font-display text-3xl md:text-5xl text-white leading-tight ${titleClassName}`}>{title}</h2>
      {description ? (
        <p className={`text-lg leading-relaxed text-slate-300 ${descriptionClassName}`}>{description}</p>
      ) : null}
    </div>
  );
};

export default SectionIntro;
