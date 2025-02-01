import React from "react";

interface ConditionalMountProps {
  mount: boolean;
  children: React.ReactNode;
  keepMounted?: boolean;
}

const ConditionalMount: React.FC<ConditionalMountProps> = ({
  children,
  mount,
  keepMounted,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (mount) {
      setMounted(true);
    } else {
      if (!keepMounted) setMounted(false);
    }
  }, [mount, keepMounted]);

  if (!mounted) return null;
  return <>{children}</>;
};

export default ConditionalMount;
