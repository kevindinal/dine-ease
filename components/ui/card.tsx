const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
      <div className={`border p-4 rounded-lg ${className}`}>
        {children}
      </div>
    );
  };
  export { Card };
  