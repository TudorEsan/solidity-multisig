import { truncateMiddle } from "@/helpers/truncate";
import { GradientAvatar } from "./gradient-avatar";

interface DisplayAddressProps {
  address: string;
  herotag?: string;
}

export const DisplayAddress = ({ address, herotag }: DisplayAddressProps) => {
  return (
    <div className="flex gap-2 items-center w-full   ">
      <GradientAvatar text={address} size={40} />
      <div className="flex flex-col items-start">
        {herotag && <p className="text-xs">{herotag}</p>}
        <p className="text-xs ">{truncateMiddle(address, 17)}</p>
      </div>
    </div>
  );
};
