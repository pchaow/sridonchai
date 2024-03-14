export const WaterPipe = ({
                              ...props
                          }) => {
    return (
        <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            height="1em"
            width="1em"
            {...props}
        >
            <path
                d="M192 96v12L96 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l96-12 31-3.9 1-.1 1 .1 31 3.9 96 12c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 12V96c0-17.7-14.3-32-32-32s-32 14.3-32 32zM32 256c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h100.1c20.2 29 53.9 48 91.9 48s71.7-19 91.9-48H352c17.7 0 32 14.3 32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32 0-88.4-71.6-160-160-160h-32l-22.6-22.6c-6-6-14.1-9.4-22.6-9.4H256v-43.8l-32-4-32 4V224h-18.7c-8.5 0-16.6 3.4-22.6 9.4L128 256H32z"/>
        </svg>
    );
};


// icon:write | System UIcons https://systemuicons.com/ | Corey Ginnivan
import * as React from "react";

export function IconWrite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 4a2.121 2.121 0 010 3l-9.5 9.5-4 1 1-3.944 9.504-9.552a2.116 2.116 0 012.864-.125zM9.5 17.5h8M15.5 6.5l1 1" />
      </g>
    </svg>
  );
}

export function IconBahtSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 320 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M144 0c-17.7 0-32 14.3-32 32v32H37.6C16.8 64 0 80.8 0 101.6V406.3c0 23 18.7 41.7 41.7 41.7H112v32c0 17.7 14.3 32 32 32s32-14.3 32-32v-32h32c61.9 0 112-50.1 112-112 0-40.1-21.1-75.3-52.7-95.1 13-18.3 20.7-40.7 20.7-64.9 0-61.9-50.1-112-112-112V32c0-17.7-14.3-32-32-32zm-32 128v96H64v-96h48zm64 96v-96c26.5 0 48 21.5 48 48s-21.5 48-48 48zm-64 64v96H64v-96h48zm64 96v-96h32c26.5 0 48 21.5 48 48s-21.5 48-48 48h-32z" />
    </svg>
  );
}


