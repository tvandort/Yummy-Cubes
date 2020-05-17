import cx from 'classnames';

export default function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        'border bg-blue-600 text-white px-3 py-2 font-bold rounded-md',
        className
      )}
    >
      {children}
    </button>
  );
}
