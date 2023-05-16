export default function cn(...classNames: (string | undefined | null)[]): string {
    return classNames.filter(Boolean).join(' ');
  }