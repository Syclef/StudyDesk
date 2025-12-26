import React from "react";

interface JustificationProps {
  justification: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export const JustificationPanel: React.FC<JustificationProps> = ({
  justification,
}) => {
  return (
    <section className="justification-panel">
      <h3>Justification</h3>

      <p>
        <strong>a.</strong> {justification.a}
      </p>
      <p>
        <strong>b.</strong> {justification.b}
      </p>
      <p>
        <strong>c.</strong> {justification.c}
      </p>
      <p>
        <strong>d.</strong> {justification.d}
      </p>
    </section>
  );
};
