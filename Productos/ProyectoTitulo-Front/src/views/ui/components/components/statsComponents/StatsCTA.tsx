import React from "react";
import "./StatsCTA.css";

type StatsCTAProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  icon?: string;
  onClick?: () => void;
};

const StatsCTA: React.FC<StatsCTAProps> = ({
  title,
  subtitle,
  buttonText,
  icon = "bar_chart",
  onClick,
}) => {
  return (
    <div className="stats-cta">
      <div className="stats-cta__content">
        <h4
          className="stats-cta__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <p className="stats-cta__subtitle">{subtitle}</p>

        <button className="stats-cta__button" onClick={onClick}>
          {buttonText}
          <span className="material-symbols-outlined stats-cta__btn-icon">
            trending_up
          </span>
        </button>
      </div>

      <span className="material-symbols-outlined stats-cta__bg-icon">
        {icon}
      </span>
    </div>
  );
};

export default StatsCTA;