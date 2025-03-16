// Custom icons for smoking/non-smoking features
import type React from "react"

export function Cigarette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 12H2v4h16" />
      <path d="M22 12v4" />
      <path d="M7 12v4" />
      <path d="M18 8c0-2.5-2-2.5-2-5" />
      <path d="M22 8c0-2.5-2-2.5-2-5" />
    </svg>
  )
}

export function CigaretteOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M12 12H2v4h14" />
      <path d="M22 12v4" />
      <path d="M18 12v4" />
      <path d="M18 8c0-2.5-2-2.5-2-5" />
      <path d="M22 8c0-2.5-2-2.5-2-5" />
    </svg>
  )
}

