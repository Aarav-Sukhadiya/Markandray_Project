const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.primary;
  return (
    <Tag className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
