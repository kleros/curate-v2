import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

import SecuredByKlerosLogo from "svgs/footer/secured-by-kleros.svg";

import { socialmedia } from "consts/socialmedia";

import LightButton from "components/LightButton";

const SecuredByKleros: React.FC = () => (
  <Link to="https://kleros.io" target="_blank" rel="noopener noreferrer">
    <SecuredByKlerosLogo className="min-h-6 transition duration-100 [&_path]:fill-white/75 hover:[&_path]:fill-white" />
  </Link>
);

const SocialMedia = () => (
  <div className="flex [&_.button-svg]:mr-0">
    {Object.values(socialmedia).map((site, i) => (
      <Link key={site.url} to={site.url} target="_blank" rel="noopener noreferrer">
        <LightButton Icon={site.icon} text="" />
      </Link>
    ))}
  </div>
);

const Footer: React.FC = () => (
  <div
    className={clsx(
      "flex flex-col justify-center items-center gap-4 p-2 w-full h-[114px]",
      "bg-klerosUIComponentsPrimaryPurple dark:bg-klerosUIComponentsLightBlue",
      "lg:h-16 lg:flex-row lg:justify-between lg:px-8"
    )}
  >
    <SecuredByKleros />
    <SocialMedia />
  </div>
);

export default Footer;
