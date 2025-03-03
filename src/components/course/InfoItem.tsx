import { InfoItemProps } from "./types";

const InfoItem = ({ icon, label, value, isLast = false }: InfoItemProps) => (
  <div
    className={`flex items-center justify-between ${
      !isLast ? "border-b pb-4" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="text-gray-500">{icon}</div>
      <span className="text-gray-600">{label}:</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

export default InfoItem;
