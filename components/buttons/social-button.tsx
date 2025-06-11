import React, { FC } from "react";
import SocialLogin from "react-social-login";

interface ISocialProps {
  className: any;
  children: React.ReactNode;
  triggerLogin: () => void;
}

const SocialButton: FC<ISocialProps> = (props: ISocialProps) => {
  const { children } = props;
  return (
    <button {...props} onClick={() => props.triggerLogin()}>
      {children}
    </button>
  );
};

export default SocialLogin(SocialButton);
