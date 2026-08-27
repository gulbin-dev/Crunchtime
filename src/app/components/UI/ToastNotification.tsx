import { ToastContentProps } from "react-toastify";
interface NotityProp extends Partial<ToastContentProps> {
  text: string;
  emphasisText?: string;
  message?: string;
}
export const SuccessToast = ({ text, emphasisText }: NotityProp) => {
  return (
    <div className="text-white">
      <p className="text-center">
        {text} <span className="font-bold">{emphasisText}</span>
      </p>
    </div>
  );
};

export const ErrorToast = ({ text, emphasisText }: NotityProp) => {
  return (
    <div className="text-white">
      <p className="text-center">
        {text} <span className="font-bold">{emphasisText}</span>
      </p>
    </div>
  );
};
