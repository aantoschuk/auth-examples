import { ReactNode } from "react";

type TProps = {
  content: ReactNode;
  handler: () => void;
  border?: boolean;
};

export const Button = (props: TProps) => {
  const { handler, content, border } = props;

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${border && "border-1"}`}
      onClick={handler}
    >
      {content}
    </button>
  );
};
