import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'ghost';
  shape?: 'pill' | 'rounded';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Brand button. primary = blue · dark = black pill (white pill on dark mode,
 * for use on gradients) · outline / ghost map to Gluestack variants.
 */
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  shape = 'pill',
  loading = false,
  disabled = false,
  className = '',
}: AppButtonProps) {
  const shapeClass = shape === 'pill' ? 'rounded-full' : 'rounded-xl';

  if (variant === 'dark') {
    return (
      <Button
        onPress={onPress}
        isDisabled={disabled || loading}
        className={`${shapeClass} bg-typography-black dark:bg-white h-12 ${className}`}
      >
        {loading && <ButtonSpinner className="text-white dark:text-typography-black" />}
        <ButtonText className="font-semibold text-white dark:text-typography-black">
          {loading ? 'Please wait…' : title}
        </ButtonText>
      </Button>
    );
  }

  const gluestackVariant = variant === 'primary' ? 'default' : variant;

  return (
    <Button
      variant={gluestackVariant}
      onPress={onPress}
      isDisabled={disabled || loading}
      className={`${shapeClass} ${className}`}
    >
      {loading && <ButtonSpinner />}
      <ButtonText>{loading ? 'Please wait…' : title}</ButtonText>
    </Button>
  );
}
