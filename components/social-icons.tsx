type IconProps = {
  size?: number;
  className?: string;
};

export function InstagramIcon({
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1.1"
        fill="currentColor"
      />
    </svg>
  );
}

export function FacebookIcon({
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21V13.2H16.1L16.5 10.1H13.5V8.1C13.5 7.2 13.8 6.6 15 6.6H16.6V3.8C16.3 3.8 15.4 3.7 14.4 3.7C12.1 3.7 10.6 5.1 10.6 7.6V10.1H8V13.2H10.6V21H13.5Z" />
    </svg>
  );
}

export function ThreadsIcon({
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12.6 20.1C8.3 20.1 5.6 17.4 5.6 13.1C5.6 8.7 8.1 4.7 12.2 4.1C15.8 3.6 18.7 5.2 19.5 8.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8.8 9.2C10.1 8.4 11.7 8 13.2 8.1C17.2 8.3 19.4 10.4 19.4 13.3C19.4 16.7 16.8 18.9 13.3 18.9C10.1 18.9 8.2 17.4 8.2 15.1C8.2 12.8 10 11.4 12.9 11.4C16.3 11.4 18.3 13 18.3 15.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M12.9 11.4C13.6 12 14 13 14 14.2C14 15.6 13.4 16.5 12.3 16.5C11.3 16.5 10.6 15.9 10.6 15C10.6 14 11.3 13.3 12.5 13.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5C6.75 2.5 2.5 6.65 2.5 11.8C2.5 13.7 3.05 15.45 4.05 16.95L2.85 21.4L7.45 20.2C8.8 20.95 10.35 21.35 12 21.35C17.25 21.35 21.5 17.2 21.5 12.05C21.5 6.9 17.25 2.5 12 2.5ZM12 19.65C10.55 19.65 9.2 19.25 8.05 18.55L7.8 18.4L5.1 19.1L5.8 16.5L5.65 16.25C4.75 15 4.25 13.45 4.25 11.85C4.25 7.6 7.7 4.2 12 4.2C16.3 4.2 19.75 7.6 19.75 11.85C19.75 16.1 16.3 19.65 12 19.65ZM16.75 14.2C16.5 14.05 15.2 13.4 14.95 13.3C14.7 13.2 14.5 13.15 14.3 13.45C14.1 13.75 13.55 14.4 13.4 14.55C13.25 14.75 13.05 14.75 12.8 14.65C12.55 14.5 11.8 14.25 10.9 13.45C10.2 12.85 9.75 12.1 9.6 11.85C9.45 11.6 9.6 11.45 9.75 11.3C9.9 11.15 10.05 11 10.15 10.8C10.25 10.65 10.2 10.5 10.15 10.35C10.05 10.2 9.6 9.05 9.4 8.6C9.2 8.15 9 8.2 8.85 8.2H8.35C8.15 8.2 7.85 8.3 7.6 8.6C7.35 8.9 6.7 9.5 6.7 10.7C6.7 11.9 7.6 13.05 7.7 13.2C7.85 13.35 9.5 15.9 12.05 17C12.65 17.3 13.15 17.45 13.55 17.6C14.15 17.8 14.7 17.75 15.15 17.65C15.65 17.55 16.7 17 16.9 16.4C17.1 15.8 17.1 15.3 17.05 15.2C17 15.05 16.95 14.95 16.75 14.2Z" />
    </svg>
  );
}