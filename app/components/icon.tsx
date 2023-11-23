import * as Icons from "lucide-react";

interface IconTypes {
  icon: string;
  className: string;
}

export default function Icon({ icon, className }: IconTypes) {
  const IconComp = Icons[icon] ?? Icons.AlertTriangle;

  return <IconComp className={className} />;
}
